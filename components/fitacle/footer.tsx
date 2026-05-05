"use client"

import { motion } from "framer-motion"
import { Instagram, Twitter, Youtube, Linkedin, Mail, ArrowRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"

const footerLinks = {
  product: [
    { label: "Body Analyzer", href: "#analyzer" },
    { label: "Daily Plans", href: "#plan" },
    { label: "Gym Partner", href: "#partner" },
    { label: "Fitacle Score", href: "#score" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Contact", href: "mailto:contact@fitacle.com" },
  ],
  resources: [
    { label: "Blog", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
    { label: "API Docs", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
}

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/fitacle_official", label: "Instagram", highlight: true },
  { icon: Twitter, href: "#", label: "Twitter", highlight: false },
  { icon: Youtube, href: "#", label: "YouTube", highlight: false },
  { icon: Linkedin, href: "#", label: "LinkedIn", highlight: false },
]

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 bg-background overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 relative">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-foreground rounded-3xl p-12 md:p-16 mb-20 text-center overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/4 w-full h-full rounded-full bg-background/5 blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -left-1/4 w-full h-full rounded-full bg-background/5 blur-3xl"
            />
          </div>
          
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-background tracking-tight text-balance"
            >
              Ready to Start Your
              <br />
              Transformation?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-background/70 text-lg max-w-xl mx-auto mb-8"
            >
              Join thousands of people who have transformed their bodies and lives with FITACLE.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href="#analyzer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-8 py-4 bg-background text-foreground rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
              <span className="text-background/60 text-sm">No credit card required</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <motion.a 
              href="#" 
              className="flex items-center gap-3 mb-5 group"
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated logo with glow */}
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Image
                  src="/images/fitacle-logo.png"
                  alt="FITACLE Logo"
                  width={44}
                  height={44}
                  className="relative rounded-xl shadow-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  F<span className="text-emerald-600">i</span>tacle
                </span>
                <span className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase">
                  Transform Beyond Limits
                </span>
              </div>
            </motion.a>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs">
              Your AI-powered fitness companion for lasting transformation and sustainable results.
            </p>
            
            {/* Contact Email - Prominent */}
            <motion.a
              href="mailto:contact@fitacle.com"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent border border-border rounded-xl text-sm font-medium text-foreground hover:bg-accent/80 transition-all duration-300 mb-6"
            >
              <Mail size={16} />
              contact@fitacle.com
              <ArrowUpRight size={14} className="text-muted-foreground" />
            </motion.a>
            
            {/* Instagram Highlight Banner */}
            <motion.a
              href="https://instagram.com/fitacle_official"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="group flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300"
            >
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg"
              >
                <Instagram size={18} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Follow us on Instagram</p>
                <p className="text-sm font-semibold text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all">@fitacle_official</p>
              </div>
              <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-pink-500 transition-colors" />
            </motion.a>
            
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    social.highlight 
                      ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white border-transparent hover:shadow-lg hover:shadow-pink-500/20" 
                      : "bg-accent border-border hover:bg-foreground hover:text-background hover:border-foreground"
                  }`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get fitness tips and updates directly to your inbox.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full py-2.5 pl-10 pr-3 bg-accent border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-foreground rounded-xl text-background hover:bg-foreground/90 transition-colors shadow-md hover:shadow-lg"
              >
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FITACLE. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
