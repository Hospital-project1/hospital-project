// app/about/page.js
import { Heart, Shield, Users, UserCircle, Stethoscope, Pill, Accessibility } from 'lucide-react';
import TeamMemberCard from '@/components/TeamMemberCard';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Ahmed",
      role: "Lead Pediatrician",
      bio: "Ensures all features meet medical standards",
      icon: <UserCircle className="text-[#0CB8B6]" size={28} />
    },
    {
      name: "Dr. Ali Mohammad",
      role: "Tech Lead",
      bio: "Makes the magic happen with code",
      icon: <Stethoscope className="text-[#0CB8B6]" size={28} />
    },
    {
      name: "Dr. Ahmad ",
      role: "Pediatric Researcher",
      bio: "Brings evidence-based practices to our platform",
      icon: <Users className="text-[#0CB8B6]" size={28} />
    },
    // Add other team members...
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Caring for Your <span className="text-[#0CB8B6]">Little Stars</span>
              </h1>
              <div className="w-20 h-1 bg-[#CE592C] mb-6"></div>
              <p className="text-xl text-gray-600 mb-8">
                Where technology meets compassionate pediatric care
              </p>
              <button className="bg-[#CE592C] hover:bg-[#CE592C]/90 text-white font-bold py-3 px-8 rounded-md inline-block transition-all">
                Learn More
              </button>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-72 h-72 mx-auto bg-[#0CB8B6]/10 rounded-full flex items-center justify-center">
                <Pill className="text-[#0CB8B6] absolute top-10 left-6" size={64} />
                <Heart className="text-[#CE592C] absolute bottom-8 right-8" size={64} />
                <div className="text-6xl">👶</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Story</h2>
          <div className="w-16 h-1 bg-[#0CB8B6] mx-auto"></div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-[#0CB8B6]">
          <p className="text-lg mb-6">
            Founded in 2024 by a team of parents and pediatricians, LittleStars was born from a simple 
            idea: <span className="font-semibold text-[#CE592C]">hospital management shouldn't be stressful</span> when your child needs care.
          </p>
          <p className="text-lg">
            We combine cutting-edge technology with child-centered design to create a system that works 
            for everyone - doctors, nurses, and most importantly - you and your little ones.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4 bg-[#0CB8B6]/95 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Our Promise to You</h2>
            <div className="w-16 h-1 bg-white mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard 
              icon={<Heart size={42} />}
              title="Child-First Design"
              description="Every feature designed with kids in mind"
            />
            <ValueCard 
              icon={<Shield size={42} />}
              title="Secure Data"
              description="Military-grade encryption for your privacy"
            />
            <ValueCard 
              icon={<Stethoscope size={42} />}
              title="Compassionate Care"
              description="Built by doctors who understand"
            />
            <ValueCard 
              icon={<Accessibility size={42} />}
              title="Accessible to All"
              description="Multiple languages & ADA compliant"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Meet Our <span className="text-[#0CB8B6]">Star</span> Team
          </h2>
          <div className="w-16 h-1 bg-[#CE592C] mx-auto"></div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              What Parents Say
            </h2>
            <div className="w-16 h-1 bg-[#0CB8B6] mx-auto"></div>
          </div>
          <div className="space-y-8">
            <Testimonial 
              quote="Booking appointments feels like a game for my kids!"
              author="Fatima, mother of 3"
            />
            <Testimonial 
              quote="Finally a system that understands busy parents."
              author="Khalid, father of twins"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to Experience Better Care?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of families who've made healthcare management stress-free with LittleStars.
          </p>
          <button className="bg-[#CE592C] hover:bg-[#CE592C]/90 text-white font-bold py-3 px-8 rounded-md inline-block transition-all text-lg">
            Join Our Community
          </button>
        </div>
      </section>
    </div>
  );
}

// Component for Value Cards
function ValueCard({ icon, title, description }) {
  return (
    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm text-center hover:bg-white/20 transition-all">
      <div className="mb-4 text-white">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/90">{description}</p>
    </div>
  );
}

// Component for Testimonials
function Testimonial({ quote, author }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md relative border-l-4 border-[#CE592C]">
      <div className="text-5xl absolute top-4 left-4 text-[#0CB8B6]/20">"</div>
      <p className="text-lg pl-6 pr-4 py-2 italic text-gray-700">{quote}</p>
      <div className="w-12 h-1 bg-[#0CB8B6] my-4 ml-6"></div>
      <p className="pl-6 font-medium text-gray-800">— {author}</p>
    </div>
  );
}