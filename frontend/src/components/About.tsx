'use client';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Hakkımızda</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Aytekin Auto, mükemmel aracınızı bulmanızda güvenilir ortağınız. Otomotiv sektöründeki yılların deneyimiyle,
            yüksek kaliteli araçlar ve olağanüstü müşteri hizmeti sunmaktan gurur duyuyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 p-6 rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-3">Kaliteli Araçlar</h3>
            <p className="text-gray-400">
              Müşterilerimize en yüksek kaliteyi sunmak için her aracı özenle seçiyor ve inceliyoruz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/5 p-6 rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-3">Uzman Hizmet</h3>
            <p className="text-gray-400">
              Otomotiv uzmanlarımız, ihtiyaçlarınıza uygun mükemmel aracı bulmanıza yardımcı olmak için burada.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/5 p-6 rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-3">Müşteri Odaklı</h3>
            <p className="text-gray-400">
              Müşteri memnuniyetini önceliğimiz yapıyor, her adımda şeffaf ve dürüst hizmet sunuyoruz.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
