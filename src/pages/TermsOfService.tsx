import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function TermsOfService() {
  return (
    <div className="min-h-[100svh] font-poppins bg-[#050505] text-white flex flex-col overflow-x-hidden">
      <SEO 
        title="Terms and Conditions"
        description="Review the terms and conditions for using the Sledge Mentorship platform and participating in our programs."
        keywords="terms of service, legal, Sledge Mentorship"
      />
      <div className="relative z-50 w-full flex-shrink-0">
        <Header />
      </div>
      <main className="flex-grow pt-12 md:pt-20 pb-24 px-6 md:px-12 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Terms and Conditions</h1>
          <p className="text-white/50 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
              <p>
                Welcome to SLEDGE. By accessing or using our mentorship program, SLEDGE Plus, and any associated services, you agree to be bound by these Terms and Conditions. Please read them carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Use of Services</h2>
              <p>
                Our services are designed to empower teams and students to discover and pursue their professional purpose. You agree to use these services only for lawful purposes and in accordance with these Terms. You are responsible for ensuring that all information you provide is accurate and up-to-date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Registration and Accounts</h2>
              <p>
                To access certain features, you may be required to register. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. SLEDGE reserves the right to terminate accounts that violate these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Payment and Fees</h2>
              <p>
                Certain programs, such as SLEDGE Plus or specific coaching sessions, require payment. All fees and applicable taxes must be paid in full prior to the commencement of the program or session. We process payments securely through certified third-party providers (like Stripe and Paystack).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Cancellation and Refund Policy</h2>
              <p>
                Cancellations must be made in accordance with our specific program guidelines. Refunds, if applicable, are processed at the sole discretion of the SLEDGE administration team and may be subject to processing fees.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Code of Conduct</h2>
              <p>
                We expect all participants to maintain a professional, respectful, and inclusive environment. Harassment, discrimination, or abusive behavior will not be tolerated and will result in immediate termination of access to our services without refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
              <p>
                SLEDGE shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes. Continued use of the platform after such modifications constitutes your acceptance of the revised Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:info@sledgementorship.com" className="text-green-400 hover:underline">info@sledgementorship.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
