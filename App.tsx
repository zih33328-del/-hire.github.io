
import React, { useState, useEffect, useRef } from 'react';
import { Project, GalleryItem, ChatMessage } from './types';
import { getGeminiResponse } from './geminiService';

// --- Sub-components (defined outside to avoid re-renders) ---

const Navbar: React.FC = () => (
  <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        AURORA
      </div>
      <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
        <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
        <a href="#projects" className="hover:text-blue-600 transition-colors">Projects</a>
        <a href="#gallery" className="hover:text-blue-600 transition-colors">Gallery</a>
        <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
      </div>
      <button className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
        Hire Me
      </button>
    </div>
  </nav>
);

const Hero: React.FC = () => (
  <section id="home" className="pt-32 pb-20 px-6">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
          Available for new opportunities
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Crafting Digital <br />
          <span className="text-indigo-600">Masterpieces</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-lg">
          I'm a Full-stack Developer specialized in building high-performance web applications with a focus on AI integration and exceptional user experiences.
        </p>
        <div className="flex space-x-4 pt-4">
          <a href="#projects" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-all">
            View Work
          </a>
          <a href="#gallery" className="border border-slate-300 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-all">
            Inspiration
          </a>
        </div>
      </div>
      <div className="relative">
        <div className="w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl animate-float">
          <img 
            src="https://picsum.photos/id/101/1200/800" 
            alt="Hero Visual" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden md:block">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://picsum.photos/id/${10 + i}/50/50`} className="w-8 h-8 rounded-full border-2 border-white" alt="Client" />
              ))}
            </div>
            <div className="text-sm font-medium">
              Trusted by <br /><span className="text-indigo-600">50+ Global Clients</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="h-56 overflow-hidden relative">
      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
    </div>
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded">{tag}</span>
        ))}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-4">{project.description}</p>
      <button className="text-indigo-600 font-semibold text-sm inline-flex items-center group-hover:underline">
        View Project 
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </div>
);

const Gallery: React.FC<{ items: GalleryItem[] }> = ({ items }) => (
  <section id="gallery" className="py-24 px-6 bg-slate-100">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Visual Inspiration</h2>
        <p className="text-slate-600">A collection of external images curated for design inspiration.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={item.id} className={`relative overflow-hidden rounded-lg group h-64 ${idx % 3 === 0 ? 'md:col-span-2' : ''}`}>
            <img 
              src={item.download_url} 
              alt={item.author} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-white text-xs font-medium">Shot by {item.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const response = await getGeminiResponse(input, history);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] dark-glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse text-xs">AI</div>
              <div>
                <h4 className="text-white text-sm font-bold">Aurora AI</h4>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="text-[10px] text-white/60">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center text-white/40 text-sm mt-10 px-4">
                "Hello! I'm Aurora's AI. Ask me about her skills, experience, or anything professional!"
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white/10 text-white rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message AI..."
                className="w-full bg-white/10 text-white text-sm rounded-full py-2.5 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-white/30"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-1.5 top-1.5 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 relative group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-12 right-0 bg-slate-900 text-white text-[10px] px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask my Assistant
          </span>
        </button>
      )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const projects: Project[] = [
    {
      id: 1,
      title: "Visionary AI Dashboard",
      description: "A real-time analytics platform leveraging computer vision to track user engagement.",
      image: "https://picsum.photos/id/1/600/400",
      tags: ["React", "TensorFlow", "D3.js"]
    },
    {
      id: 2,
      title: "Lumina eCommerce",
      description: "High-performance headless commerce site with seamless transitions and 3D previews.",
      image: "https://picsum.photos/id/2/600/400",
      tags: ["Next.js", "Three.js", "Stripe"]
    },
    {
      id: 3,
      title: "Nexus Social Engine",
      description: "A decentralized social network focused on data privacy and community governance.",
      image: "https://picsum.photos/id/3/600/400",
      tags: ["Web3", "Tailwind", "Solidity"]
    },
    {
      id: 4,
      title: "Aero Flight Tracker",
      description: "Interactive global flight map with predictive arrival algorithms using open data.",
      image: "https://picsum.photos/id/4/600/400",
      tags: ["Mapbox", "Node.js", "API"]
    }
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('https://picsum.photos/v2/list?page=2&limit=8');
        const data = await res.json();
        setGalleryItems(data);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />

        {/* Projects Section */}
        <section id="projects" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-4xl font-bold mb-2">Featured Projects</h2>
                <p className="text-slate-500">A selection of my recent works across different industries.</p>
              </div>
              <a href="#" className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1 hover:text-indigo-700 hover:border-indigo-700 transition-all">
                View All Projects
              </a>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Gallery Section */}
        {loading ? (
          <div className="py-24 text-center">Loading Inspiration...</div>
        ) : (
          <Gallery items={galleryItems} />
        )}

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Let's Build Something Great</h2>
            <p className="text-slate-600 mb-10 text-lg">
              Currently accepting new projects and collaborations. If you have an idea or just want to chat, feel free to drop a line.
            </p>
            <form className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Name</label>
                <input type="text" className="w-full bg-slate-50 border-none rounded-lg p-4 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Email</label>
                <input type="email" className="w-full bg-slate-50 border-none rounded-lg p-4 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="john@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Message</label>
                <textarea rows={4} className="w-full bg-slate-50 border-none rounded-lg p-4 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Tell me about your project..."></textarea>
              </div>
              <div className="md:col-span-2 text-center">
                <button className="bg-indigo-600 text-white px-12 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-200 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm space-y-4 md:space-y-0">
          <div>&copy; {new Date().getFullYear()} Aurora Studio. Built with React & AI.</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-indigo-600">Twitter</a>
            <a href="#" className="hover:text-indigo-600">LinkedIn</a>
            <a href="#" className="hover:text-indigo-600">GitHub</a>
            <a href="#" className="hover:text-indigo-600">Dribbble</a>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default App;
