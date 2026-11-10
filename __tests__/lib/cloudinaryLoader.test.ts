import cloudinaryLoader, { isCloudinaryUrl } from "@/lib/cloudinaryLoader";

const PHOTO = "https://res.cloudinary.com/dmltxho0z/image/upload/v1794303368/kartsquare/categories/agriculture-and-farming.webp";

describe("cloudinaryLoader", () => {
  it("asks Cloudinary for the requested width, auto format and auto quality, never upscaled", () => {
    expect(cloudinaryLoader({ src: PHOTO, width: 640 })).toBe(
      "https://res.cloudinary.com/dmltxho0z/image/upload/f_auto,q_auto,c_limit,w_640/v1794303368/kartsquare/categories/agriculture-and-farming.webp",
    );
  });

  it("uses the quality next/image passes when it passes one", () => {
    expect(cloudinaryLoader({ src: PHOTO, width: 384, quality: 60 })).toContain("/upload/f_auto,q_60,c_limit,w_384/v1794303368/");
  });

  it("gives every width its own URL, so the browser can pick from a srcset", () => {
    const urls = [256, 384, 640, 1080].map((width) => cloudinaryLoader({ src: PHOTO, width }));
    expect(new Set(urls).size).toBe(4);
  });

  it("leaves URLs that are not Cloudinary uploads untouched", () => {
    expect(cloudinaryLoader({ src: "https://images.unsplash.com/photo-1", width: 640 })).toBe("https://images.unsplash.com/photo-1");
    expect(cloudinaryLoader({ src: "/images/home/barber.jpg", width: 640 })).toBe("/images/home/barber.jpg");
  });

  it("recognises Cloudinary upload URLs only", () => {
    expect(isCloudinaryUrl(PHOTO)).toBe(true);
    expect(isCloudinaryUrl("https://res.cloudinary.com.evil.example/image/upload/x.webp")).toBe(false);
    expect(isCloudinaryUrl("https://kartsquare.com/images/categories/x.webp")).toBe(false);
  });
});
