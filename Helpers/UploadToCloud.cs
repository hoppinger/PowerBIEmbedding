using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.Extensions.Options;

namespace PowerBIPoC.Helpers
{
    public class UploadToCloud
    {
        private BlobStorageOptions _blobStorageOptions { get; set; }
        private CloudBlobContainer _container {get; set; }
        public UploadToCloud(BlobStorageOptions blobStorageOptions)
        {
            this._blobStorageOptions = blobStorageOptions;
            var storageCredentials = new StorageCredentials(_blobStorageOptions.AccountName, _blobStorageOptions.KeyValue);
            var cloudStorageAccount = new CloudStorageAccount(storageCredentials, true);
            var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();

            this._container = cloudBlobClient.GetContainerReference(_blobStorageOptions.ContainerReference);
        }
        public async Task<string> UploadImage(Stream image, string filename)
        {
            if (image == null) return "";

            var newBlob = _container.GetBlockBlobReference(Guid.NewGuid() + filename);
            await newBlob.UploadFromStreamAsync(image);

            return newBlob.Uri.ToString();
        }
        public async Task<Boolean> DeleteImage(string image)
        {
            Uri outUri;
            if (Uri.TryCreate(image, UriKind.Absolute, out outUri))
            {
              string filename = System.IO.Path.GetFileName(outUri.LocalPath);
              var newBlob = _container.GetBlockBlobReference(filename);
              await newBlob.DeleteIfExistsAsync();
            }
            return true;
        }
    }
}