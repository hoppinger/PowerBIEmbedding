
using System;
using System.IO;
using Microsoft.AspNetCore.Http;
namespace PowerBIPoC.Services
{
    public interface IImageProcessor
    {
        string ResizeBase64Image(String originalImage, int size);
        string ResizeBase64Image(String originalImage, int width, double aspectRatio);
        byte[] ConvertFileToByteArray(IFormFile image, int? size);
        Stream ResizeBlobImage(Stream originalImage, int size);
    }
}