import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[100svh] font-poppins bg-[#050505] text-white flex flex-col overflow-x-hidden">
      <SEO 
        title="Privacy Policy"
        description="Learn how Sledge Mentorship protects your personal information and manages data privacy."
        keywords="privacy policy, data protection, Sledge Mentorship"
      />
      <div className="relative z-50 w-full flex-shrink-0">
        <Header />
      </div>
      <main className="flex-grow pt-12 md:pt-20 pb-24 px-6 md:px-12 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Privacy Policy</h1>
          <p className="text-white/50 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
              <p>
                At SLEDGE, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide to us when using our website and mentorship programs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>
              <p className="mb-4">We collect information that you actively provide to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal identification information (Name, email address, phone number)</li>
                <li>Professional and educational background details</li>
                <li>Payment transaction data (processed securely by third parties; we do not store full credit card numbers)</li>
                <li>Communications and interactions with mentors and staff</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, operate, and maintain our mentorship programs</li>
                <li>To process transactions and manage your registration</li>
                <li>To communicate with you regarding updates, sessions, and support</li>
                <li>To connect you appropriately with mentors and resources</li>
                <li>To improve and personalizes your experience on our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Protection and Security</h2>
              <p>
                We implement robust security measures to maintain the safety of your personal information. Your data is stored on secure servers and protected against unauthorized access, alteration, disclosure, or destruction. We utilize industry-standard encryption for sensitive data transmissions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Third-Party Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our partners and trusted affiliates. We utilize third-party services (like payment processors and communication tools) solely to facilitate our operations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information. If you wish to exercise these rights, please contact us. Please note that certain data retention may be required for legal or operational purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Changes to this Policy</h2>
              <p>
                SLEDGE may update this privacy policy at any time. We encourage users to frequently check this page for any changes. You acknowledge and agree that it is your responsibility to review this privacy policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at <a href="mailto:info@sledgementorship.com" className="text-green-400 hover:underline">info@sledgementorship.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
