namespace Zesty
{
    public class Formats
    {
        public enum Types
        {
            Tall,
            Wide,
            Square
        }

        public enum Styles
        {
            Standard,
            Minimal,
            Transparent
        }

        public struct Format
        {
            public Format(double width, double height, string[] images)
            {
                Width = width;
                Height = height;
                Images = images;
            }

            public double Width { get; }
            public double Height { get; }
            public string[] Images { get; }
        }

        // Tall
        static string[] tallImages = {
            $"{Constants.CDN_URL}/images/zesty/zesty-banner-tall.png",
            $"{Constants.CDN_URL}/images/zesty/zesty-banner-tall.png",
            $"{Constants.CDN_URL}/images/zesty/zesty-banner-tall-transparent.png",
        };
        public static Format Tall = new Format(0.75, 1, tallImages);

        // Wide
        static string[] wideImages = {
            $"{Constants.CDN_URL}/images/zesty/zesty-banner-wide.png",
            $"{Constants.CDN_URL}/images/zesty/zesty-banner-wide.png",
            $"{Constants.CDN_URL}/images/zesty/zesty-banner-wide-transparent.png",
        };
        public static Format Wide = new Format(4, 1, wideImages);

        // Square
        static string[] squareImages = {
            $"{Constants.CDN_URL}/images/zesty/zesty-banner-square.png",
            $"{Constants.CDN_URL}/images/zesty/zesty-banner-square.png",
            $"{Constants.CDN_URL}/images/zesty/zesty-banner-square-transparent.png",
        };
        public static Format Square = new Format(1, 1, squareImages);

    }
}
