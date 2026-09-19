import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import MarketingFooter from "../components/MarketingFooter";
import Button from "../components/ui/Button";
import { contactService } from "../services/contact.service";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      await contactService.submit(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      <SEO
        title="Contact — HRPayroll"
        description="Get in touch about self-hosting, compliance, or setup questions."
        url="https://yourdomain.com/contact"
      />
      <Navbar />

      <section className="py-(--spacing-section) px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-lg bg-(--color-primary-soft) flex items-center justify-center mx-auto">
              <Mail size={22} className="text-(--color-primary)" />
            </div>
            <h1 className="text-(length:--text-section-title) font-bold text-(--color-navy) mt-4">
              Get in Touch
            </h1>
            <p className="text-(--color-text-muted) mt-2">
              Questions about setup, self-hosting, or compliance? Send a message and we'll reply by email.
            </p>
          </div>

          {status === "success" ? (
            <div className="bg-(--color-accent-soft) border border-(--color-accent) rounded-(--radius-card) p-6 text-center">
              <CheckCircle2 size={32} className="text-(--color-accent) mx-auto" />
              <p className="text-(--color-navy) font-semibold mt-3">Message sent</p>
              <p className="text-(--color-text-muted) text-(length:--text-small) mt-1">
                Thanks for reaching out — we'll get back to you by email soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-(--color-primary) text-(length:--text-small) font-medium mt-4 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-(length:--text-small) font-medium text-(--color-navy) mb-1">
                    Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={update("name")}
                    className="w-full border border-(--color-border) rounded-(--radius-card) px-3 py-2 text-(length:--text-small)"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-(length:--text-small) font-medium text-(--color-navy) mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className="w-full border border-(--color-border) rounded-(--radius-card) px-3 py-2 text-(length:--text-small)"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-(length:--text-small) font-medium text-(--color-navy) mb-1">
                  Subject
                </label>
                <input
                  required
                  value={form.subject}
                  onChange={update("subject")}
                  className="w-full border border-(--color-border) rounded-(--radius-card) px-3 py-2 text-(length:--text-small)"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-(length:--text-small) font-medium text-(--color-navy) mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={update("message")}
                  className="w-full border border-(--color-border) rounded-(--radius-card) px-3 py-2 text-(length:--text-small)"
                  placeholder="Tell us what you need..."
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-600 text-(length:--text-small)">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <Button icon={Send} type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </section>

      <MarketingFooter />
    </>
  );
}