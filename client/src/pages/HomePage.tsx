import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Search, Home, Shield, Zap } from 'lucide-react';

const features = [
  { icon: Search, title: 'Smart Search', description: 'Find your ideal home with powerful filters for location, price, amenities, and more.' },
  { icon: Shield, title: 'Verified Listings', description: 'Every property is verified by our team to ensure accuracy and quality.' },
  { icon: Zap, title: 'Instant Booking', description: 'Submit rental requests directly and track their status in real time.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtNC40LTMuNi04LTgtOHMtOCAzLjYtOCA4IDMuNiA4IDggOCA4LTMuNiA4LTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Find Your Perfect <span className="text-brand-400">Home</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed">
              Discover beautiful rental properties in the best neighborhoods.
              From modern lofts to charming family homes — your next chapter starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/listings">
                <Button variant="primary" size="lg" className="text-base px-8">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Listings
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="text-base px-8 border-white/20 text-white hover:bg-white/10">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto"
          >
            {[
              { value: '10K+', label: 'Properties' },
              { value: '5K+', label: 'Happy Renters' },
              { value: '50+', label: 'Cities' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-brand-400">{stat.value}</div>
                <div className="text-sm text-neutral-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-3">Why RentHub?</h2>
          <p className="text-neutral-500 max-w-lg mx-auto">A modern rental experience designed for both renters and landlords.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2">{feature.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-display font-bold mb-3">Ready to find your next home?</h2>
          <p className="text-brand-100 mb-8 max-w-md mx-auto">Start browsing our curated collection of rental properties today.</p>
          <Link to="/listings">
            <Button variant="secondary" size="lg" className="text-base px-8">
              <Home className="w-5 h-5 mr-2" />
              Explore Properties
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
