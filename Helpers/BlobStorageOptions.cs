namespace PowerBIPoC.Helpers
{
    public class BlobStorageOptions
    {
        public string AccountName { get; set; }
        public string KeyValue { get; set; }
        public string ContainerReference { get; set; }
        public long MaxImageSizeAllowed { get; set; }
    }
}