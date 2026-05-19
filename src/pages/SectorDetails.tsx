import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function SectorDetails() {
  const { id } = useParams();
  const { t } = useTranslation();

  // نجيب كل القطاعات كـ object
  const sectors: any = t("sectorsPages", { returnObjects: true });

  // نجيب القطاع حسب الرابط
  const sector = sectors?.[id as keyof typeof sectors];

  if (!sector) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Sector not found</h2>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">

      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">{sector.title}</h1>
        <p className="text-xl max-w-2xl mx-auto">{sector.desc}</p>
      </div>

      {/* Services */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-3xl font-bold mb-10 text-center">
          {t("sectorsPages.servicesTitle")}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sector.services.map((service: string, i: number) => (
            <div
              key={i}
              className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold">{service}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <a
          href="/contact"
          className="bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold"
        >
          {t("contactNow")}
        </a>
      </div>

    </div>
  );
}

export default SectorDetails;