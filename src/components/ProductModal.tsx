import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  product: any;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");

  // تحويل الصور لأي شكل صحيح دائماً
let images: string[] = [];

if (Array.isArray(product.images) && product.images.length > 0) {
  images = product.images;
} else if (typeof product.images === "string" && product.images !== "") {
  images = product.images.split(",").map((img: string) => img.trim());
} else if (product.image) {
  images = [product.image];
}

  const [activeImage, setActiveImage] = useState(images[0]);

  // تحويل رابط اليوتيوب الى embed
  const getYoutubeEmbed = (url: string) => {
    if (!url) return "";
    return url.replace("watch?v=", "embed/");
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-5xl w-full rounded-2xl overflow-y-auto max-h-[90vh]">

        {/* Close */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-red-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-8">

          {/* اسم المنتج */}
          <h2 className="text-3xl font-bold text-center">
            {isRTL ? product.namear : product.name}
          </h2>

          {/* 🔥 Image Gallery */}
          <div className="space-y-4">
            <img
              src={activeImage}
              className="w-full h-[400px] object-cover rounded-2xl"
            />

            {/* Thumbnails */}
            <div className="flex gap-3 flex-wrap justify-center">
              {images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImage(img)}
                  className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-4 ${
                    activeImage === img ? "border-blue-600" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 🎬 Video */}
          {product.video && (
            <div className="aspect-video">
              <iframe
                src={getYoutubeEmbed(product.video)}
                className="w-full h-full rounded-2xl"
                allowFullScreen
              />
            </div>
          )}

          {/* 📝 Description */}
          <p className="text-gray-700 leading-relaxed text-lg text-center">
            {isRTL
              ? product.descriptionar || product.description
              : product.description || product.descriptionar}
          </p>

        </div>
      </div>
    </div>
  );
}