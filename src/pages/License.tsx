import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function License() {
  return (
    <div className="min-h-[100svh] font-poppins bg-[#050505] text-white flex flex-col overflow-x-hidden">
      <SEO 
        title="License Information"
        description="Understand the intellectual property rights and limited license usage for Sledge Mentorship materials."
        keywords="license, copyright, intellectual property, Sledge Mentorship"
      />
      <div className="relative z-50 w-full flex-shrink-0">
        <Header />
      </div>
      <main className="flex-grow pt-12 md:pt-20 pb-24 px-6 md:px-12 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">License Information</h1>
          <p className="text-white/50 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Intellectual Property Rights</h2>
              <p>
                All content, materials, frameworks, and methodologies provided through SLEDGE, including SLEDGE Plus and coaching sessions, are the exclusive property of SLEDGE or its licensors. This encompasses text, graphics, logos, videos, audio clips, data compilations, and software.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Limited License Grant</h2>
              <p>
                Subject to your compliance with these terms and payment of any required fees, SLEDGE grants you a non-exclusive, non-transferable, non-sublicensable limited license to access and make personal, non-commercial use of the SLEDGE platform and its intellectual materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. License Restrictions</h2>
              <p className="mb-4">Under this license, you are strictly prohibited from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modifying, copying, or reproducing any of our materials without explicit written consent.</li>
                <li>Using the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
                <li>Attempting to decompile or reverse engineer any software contained on the SLEDGE web platform.</li>
                <li>Removing any copyright or other proprietary notations from the materials.</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. User-Generated Content</h2>
              <p>
                By posting or submitting content on our platform (including feedback, assignments, or community forum posts), you grant SLEDGE a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content for the purpose of operating and improving our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Termination of License</h2>
              <p>
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by SLEDGE at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Contact</h2>
              <p>
                For inquiries regarding licensing or permissions for commercial use of our materials, please contact our legal team at <a href="mailto:info@sledgementorship.com" className="text-green-400 hover:underline">info@sledgementorship.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
