using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System;

using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace PowerBIPoC.Services
{
    public class ImageProcessor: IImageProcessor
    {
        private readonly ILogger _logger;
        public ImageProcessor(ILogger logger = null)
        {
            _logger = logger;
        }

        public string ResizeBase64Image(String originalImage, int size)
        {
            string resizedBase64Image = originalImage;
            try
            {
                byte[] bytes = Convert.FromBase64String(originalImage.Split(",")[1]);
                Image image;
                Bitmap newImage;
                using (MemoryStream ms = new MemoryStream(bytes))
                {
                    image = Image.FromStream(ms);
                    if (image.Width < size) return null;
                    int width, height;
                    AssignNewDimensionValues(size, image, out width, out height);

                    newImage = new Bitmap(width, height);

                    using (var graphics = Graphics.FromImage(newImage))
                        graphics.DrawImage(image, 0, 0, width, height);

                }

                using (MemoryStream newImageStream = new MemoryStream())
                {
                    newImage.Save(newImageStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                    byte[] imageBytes = newImageStream.ToArray();
                    resizedBase64Image = "data:image/jpg;base64," + Convert.ToBase64String(imageBytes);
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, ex.Message);
                return null;
            }
            return resizedBase64Image;
        }

        public Stream ResizeBlobImage(Stream originalImage, int size)
        {
            MemoryStream newImageStream = new MemoryStream();
            try
            {
                Image image = Bitmap.FromStream(originalImage);
                int width, height;
                AssignNewDimensionValues(size, image, out width, out height);

                var newImage = new Bitmap(width, height);

                using (var graphics = Graphics.FromImage(newImage))
                    graphics.DrawImage(image, 0, 0, width, height);
                newImage.Save(newImageStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                newImageStream.Seek(0, SeekOrigin.Begin);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, ex.Message);
                return null;
            }
            return newImageStream;
        }

        public byte[] ConvertFileToByteArray(IFormFile image, int? size)
        {
            byte[] fileData = null;
            if (size != null && NeedToResize(image, size.Value))
            {
                var resizeImage = ResizeBlobImage(image.OpenReadStream(), size.Value);
                using (var binaryReader = new BinaryReader(resizeImage))
                {
                    fileData = binaryReader.ReadBytes((int)resizeImage.Length);
                }
            }
            else
            {
                using (var binaryReader = new BinaryReader(image.OpenReadStream()))
                {
                    fileData = binaryReader.ReadBytes((int)image.Length);
                }
            }
            return fileData;
        }

        private bool NeedToResize(IFormFile image, int size)
        {
            Image bmpImage = Bitmap.FromStream(image.OpenReadStream());
            return (bmpImage.Width > size);
        }

        private void AssignNewDimensionValues(int size, Image image, out int width, out int height)
        {
            if (image.Width > image.Height)
            {
                width = size;
                height = Convert.ToInt32(image.Height * size / (double)image.Width);
            }
            else
            {
                width = Convert.ToInt32(image.Width * size / (double)image.Height);
                height = size;
            }
        }

        public string ResizeBase64Image(String originalImage, int width, double aspectRatio)
        {
            string resizedBase64Image = originalImage;
            try
            {
                byte[] bytes = Convert.FromBase64String(originalImage.Split(",")[1]);

                using (MemoryStream ms = new MemoryStream(bytes))
                {
                    Image origImage = Image.FromStream(ms);
                    Image cropImage = CropImage(origImage, aspectRatio);
                    Image newImage;
                    if (cropImage.Width > width)
                    {
                        newImage = ResizeImage(cropImage, aspectRatio, width);
                    }
                    else
                    {
                        newImage = cropImage;
                    }
                    using (MemoryStream newImageStream = new MemoryStream())
                    {
                        newImage.Save(newImageStream, ImageFormat.Jpeg);
                        byte[] imageBytes = newImageStream.ToArray();
                        resizedBase64Image = "data:image/jpg;base64," + Convert.ToBase64String(imageBytes);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, ex.Message);
                return null;
            }
            return resizedBase64Image;
        }

        public Image CropImage(Image img, double aspectRatio)
        {
            const double epsilon = 0.00001;
            double imgWidth = Convert.ToDouble(img.Width);
            double imgHeight = Convert.ToDouble(img.Height);
            if (Math.Abs(imgWidth / imgHeight - aspectRatio) < epsilon)
                return img;

            if (imgWidth / imgHeight > aspectRatio)
            {
                double extraWidth = imgWidth - (imgHeight * aspectRatio);
                double cropStartFrom = extraWidth / 2;
                Bitmap bmp = new Bitmap((int)(img.Width - extraWidth), img.Height);
                Graphics grp = Graphics.FromImage(bmp);
                grp.DrawImage(img, new Rectangle(0, 0, (int)(img.Width - extraWidth), img.Height), new Rectangle((int)cropStartFrom, 0, (int)(imgWidth - extraWidth), img.Height), GraphicsUnit.Pixel);
                return (Image)bmp;
            }
            else
            {
                double extraHeight = imgHeight - (imgWidth * aspectRatio);
                double cropStartFrom = extraHeight / 2;
                Bitmap bmp = new Bitmap(img.Width, (int)(img.Height - extraHeight));
                using (Graphics grp = Graphics.FromImage(bmp))
                {
                    grp.DrawImage(img, new Rectangle(0, 0, img.Width, (int)(img.Height - extraHeight)), new Rectangle(0, (int)cropStartFrom, img.Width, (int)(imgHeight - extraHeight)), GraphicsUnit.Pixel);
                }
                return (Image)bmp;
            }
        }

        public Image ResizeImage(Image img, double aspectRatio, int width)
        {
            double targetHeight = Convert.ToDouble(width) / aspectRatio;
            Bitmap bmp = new Bitmap(width, (int)targetHeight);
            using (Graphics grp = Graphics.FromImage(bmp))
            {
                grp.DrawImage(img, new Rectangle(0, 0, bmp.Width, bmp.Height), new Rectangle(0, 0, img.Width, img.Height), GraphicsUnit.Pixel);
            }
            return bmp;
        }

    }
}