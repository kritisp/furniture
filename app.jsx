import React, { useState, useEffect } from 'react';
import {
    Search, User, LayoutGrid, FileText,
    ArrowRight, Plus, Expand, Download, Share2, ChevronRight
} from 'lucide-react';

// --- Custom Hooks for Animations ---
const useInView = (options = { threshold: 0.1 }) => {
    const [ref, setRef] = useState(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!ref) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(ref);
            }
        }, options);
        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref, options]);

    return [setRef, isInView];
};

const Reveal = ({ children, delay = 0, className = "", direction = "up", duration = 1000 }) => {
    const [ref, isInView] = useInView({ threshold: 0.1 });

    const getInitialStyle = () => {
        switch (direction) {
            case 'up': return 'translate-y-12 opacity-0';
            case 'down': return '-translate-y-12 opacity-0';
            case 'left': return 'translate-x-12 opacity-0';
            case 'right': return '-translate-x-12 opacity-0';
            default: return 'opacity-0';
        }
    };

    return (
        <div
            ref={ref}
            className={`transition-all ease-out ${isInView ? 'translate-y-0 translate-x-0 opacity-100' : getInitialStyle()
                } ${className}`}
            style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// --- Theme Colors ---
const colors = {
    navy: '#162b3c',
    white: '#ffffff',
    lightGray: '#f8f8f8',
    textDark: '#162b3c',
    textMuted: '#8b96a0'
};

// --- Components ---

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#162b3c]/95 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-8'} text-white`}>
            <div className="container mx-auto px-8 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="flex">
                        {/* Mocking the AD Logo icon */}
                        <div className="w-4 h-6 border-2 border-white rounded-l-md border-r-0"></div>
                        <div className="w-4 h-6 border-2 border-white rounded-r-md flex items-center justify-center">
                            <div className="w-1 h-3 bg-white ml-1"></div>
                        </div>
                    </div>
                    <span className="font-bold tracking-widest text-sm lg:text-base group-hover:text-gray-300 transition-colors">
                        AMARDEEP DESIGN
                    </span>
                </div>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center space-x-10 text-sm font-semibold tracking-wide">
                    {['About', 'Products', 'Spaces', 'Collabs', 'Stories', 'Contact'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-gray-300 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-white hover:after:w-full after:transition-all after:duration-300">
                            {item}
                        </a>
                    ))}
                </nav>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <LayoutGrid size={20} className="cursor-pointer hover:text-gray-300 transition-colors" />
                    <FileText size={20} className="cursor-pointer hover:text-gray-300 transition-colors" />
                    <Search size={20} className="cursor-pointer hover:text-gray-300 transition-colors" />
                    <User size={20} className="cursor-pointer hover:text-gray-300 transition-colors" />
                </div>

            </div>
        </header>
    );
};

const Hero = () => {
    return (
        <section className="relative h-screen min-h-[700px] bg-black overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-80 transition-transform duration-[20s] hover:scale-110 ease-out"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1920&h=1080")' }}
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end pb-16 container mx-auto px-8">
                <Reveal direction="up" duration={1200}>
                    <h1 className="text-white text-7xl md:text-[120px] font-bold tracking-tight leading-none">
                        Collab
                    </h1>
                </Reveal>

                {/* Slider Dots */}
                <div className="absolute bottom-16 right-8 flex space-x-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((dot, index) => (
                        <div
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${index === 0 ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatementSection = () => {
    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-8 max-w-5xl">
                <Reveal>
                    <p className="text-3xl md:text-5xl font-medium leading-[1.3] tracking-tight text-[#162b3c]">
                        We take pride in being one of the largest provider of seating systems in India, and we are now recognized as the top hybrid furniture manufacturers nationwide.
                    </p>
                    <div className="mt-12 flex items-center text-gray-500 hover:text-[#162b3c] transition-colors cursor-pointer group w-max">
                        <span className="text-sm tracking-wide mr-2">Learn more</span>
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

const CuratedSpaces = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Image (Sofa) */}
                    <Reveal direction="right" className="w-full lg:w-5/12 relative group cursor-pointer">
                        <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                            <img
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"
                                alt="Living room sofa"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            />
                        </div>
                    </Reveal>

                    {/* Right Image & Text (Barstools) */}
                    <div className="w-full lg:w-7/12 flex flex-col">
                        <Reveal direction="left" delay={200} className="relative group cursor-pointer mb-16">
                            <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                                <img
                                    src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1200"
                                    alt="Outdoor barstools"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />
                            </div>
                        </Reveal>

                        <Reveal delay={400} className="max-w-md">
                            <h2 className="text-4xl md:text-5xl font-medium text-[#162b3c] mb-8 leading-tight tracking-tight">
                                Spaces Curated by Amardeep Designs
                            </h2>
                            <button className="bg-[#162b3c] hover:bg-[#2a435c] text-white px-8 py-3.5 rounded-full text-sm font-medium transition-colors">
                                View All Spaces
                            </button>
                        </Reveal>
                    </div>

                </div>
            </div>
        </section>
    );
};

const MoodboardFeature = () => {
    const [upholstery, setUpholstery] = useState(0);
    const [frame, setFrame] = useState(0);

    const upholsteryColors = ['#b0705a', '#8b4513', '#a3b19b', '#5c6b73'];
    const frameColors = ['#1a1a1a', '#d2b48c', '#a0522d', '#5c4033'];

    return (
        <section className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Dark Section */}
            <div className="w-full lg:w-1/3 bg-[#162b3c] text-white p-12 lg:p-24 flex flex-col justify-center relative overflow-hidden">
                <Reveal direction="right">
                    <h2 className="text-5xl md:text-6xl font-medium leading-tight tracking-tight z-10 relative">
                        Add to<br />moodboard<br />in one click
                    </h2>
                </Reveal>
                {/* Decorative subtle logo in corner */}
                <div className="absolute bottom-8 left-8 opacity-20">
                    <div className="flex">
                        <div className="w-6 h-10 border-4 border-white rounded-l-xl border-r-0"></div>
                        <div className="w-6 h-10 border-4 border-white rounded-r-xl flex items-center justify-center">
                            <div className="w-2 h-4 bg-white ml-1"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Interactive Section */}
            <div className="w-full lg:w-2/3 p-8 lg:p-16 flex items-center relative">
                <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">

                    {/* Tools Menu */}
                    <Reveal delay={200} className="flex flex-row md:flex-col gap-4 order-2 md:order-1 shrink-0">
                        {[Plus, Expand, Download, Share2].map((Icon, idx) => (
                            <button key={idx} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-[#162b3c] transition-colors">
                                <Icon size={18} />
                            </button>
                        ))}
                    </Reveal>

                    {/* Main Product Image */}
                    <Reveal delay={400} className="flex-grow order-1 md:order-2">
                        <div className="aspect-square mix-blend-multiply flex items-center justify-center relative">
                            <img
                                src="https://images.unsplash.com/photo-1506439082522-834c892862a9?auto=format&fit=crop&q=80&w=800"
                                alt="Allen Chair"
                                className="max-w-full max-h-full object-contain transition-all duration-500 hover:scale-105 filter drop-shadow-2xl"
                            />
                        </div>
                    </Reveal>

                    {/* Product Details & Configurator */}
                    <Reveal direction="left" delay={600} className="w-full md:w-80 order-3 shrink-0 flex flex-col justify-center">
                        <h3 className="text-5xl font-medium text-[#162b3c] mb-16">Allen</h3>

                        {/* Upholstery Picker */}
                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium mb-1">Seat Upholstery</p>
                                    <p className="font-bold text-[#162b3c]">Boucle Fabric</p>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </div>
                            <div className="flex gap-3">
                                {upholsteryColors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setUpholstery(idx)}
                                        className={`w-6 h-6 rounded-full transition-all ${upholstery === idx ? 'ring-2 ring-offset-2 ring-[#162b3c] scale-110' : 'hover:scale-110'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Frame Picker */}
                        <div className="mb-16">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium mb-1">Frame</p>
                                    <p className="font-bold text-[#162b3c]">Ash Teak</p>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </div>
                            <div className="flex gap-3">
                                {frameColors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setFrame(idx)}
                                        className={`w-6 h-6 rounded-full transition-all ${frame === idx ? 'ring-2 ring-offset-2 ring-[#162b3c] scale-110' : 'hover:scale-110'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center mt-auto">
                            <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-[#162b3c] rounded-full text-sm font-medium transition-colors">
                                View in AR
                            </button>
                            <button className="px-6 py-2 bg-[#162b3c] hover:bg-[#2a435c] text-white rounded-full text-sm font-medium transition-colors">
                                Add to quote
                            </button>
                        </div>
                    </Reveal>

                </div>
            </div>
        </section>
    );
};

const InclusionFeature = () => {
    return (
        <section className="py-32 bg-[#faf9f8] overflow-hidden">
            <div className="container mx-auto px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Text Content */}
                    <Reveal direction="right" className="w-full lg:w-1/3">
                        <h2 className="text-5xl md:text-6xl font-medium text-[#162b3c] mb-10 leading-[1.1] tracking-tight">
                            Furniture for<br />Inclusion AD X<br />Sketch
                        </h2>
                        <button className="bg-[#162b3c] hover:bg-[#2a435c] text-white px-8 py-3.5 rounded-full text-sm font-medium transition-colors">
                            View Collab
                        </button>
                    </Reveal>

                    {/* Offset Images */}
                    <div className="w-full lg:w-2/3 relative h-[600px] md:h-[800px]">
                        {/* Background wider image */}
                        <Reveal direction="left" delay={200} className="absolute right-0 top-0 w-4/5 h-[80%] group cursor-pointer z-10">
                            <div className="w-full h-full overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=1200"
                                    alt="Interior 1"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                                />
                            </div>
                        </Reveal>

                        {/* Foreground smaller image */}
                        <Reveal direction="up" delay={400} className="absolute left-0 bottom-0 w-[45%] h-[60%] group cursor-pointer z-20 shadow-2xl">
                            <div className="w-full h-full overflow-hidden bg-gray-200">
                                <img
                                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"
                                    alt="Interior 2"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                                />
                            </div>
                        </Reveal>
                    </div>

                </div>
            </div>
        </section>
    );
};

const CategoryShowcase = () => {
    const [activeIdx, setActiveIdx] = useState(2); // Lounge Chairs active by default

    const categories = [
        { name: 'Ad Labs', count: 19, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
        { name: 'Cafe Chairs', count: 69, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' },
        { name: 'Lounge Chairs', count: 98, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80' },
        { name: 'Office Chairs', count: 38, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80' },
        { name: 'Pods', count: 28, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80' },
        { name: 'Barstool', count: 43, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80' },
        { name: 'Sofas', count: 71, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
        { name: 'Tables', count: 39, image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80' },
        { name: 'Pouffee', count: 10, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80' },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-8 flex flex-col lg:flex-row gap-16">

                {/* Category List */}
                <div className="w-full lg:w-1/2 flex flex-col space-y-2">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => setActiveIdx(idx)}
                            className="group cursor-pointer flex items-baseline relative"
                        >
                            <h3 className={`text-4xl md:text-6xl font-medium tracking-tight transition-colors duration-300 ${activeIdx === idx ? 'text-[#162b3c]' : 'text-gray-300 group-hover:text-gray-400'
                                }`}>
                                {cat.name}
                            </h3>
                            <span className={`ml-4 text-xs font-bold transition-colors duration-300 ${activeIdx === idx ? 'text-[#162b3c]' : 'text-gray-300 group-hover:text-gray-400'
                                }`}>
                                ({cat.count})
                            </span>
                        </div>
                    ))}
                </div>

                {/* Dynamic Image Display */}
                <div className="w-full lg:w-1/2 relative h-[500px] md:h-[700px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                    {categories.map((cat, idx) => (
                        <img
                            key={idx}
                            src={cat.image}
                            alt={cat.name}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${activeIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                        />
                    ))}

                    {/* Floating abstract chair (like in the screenshot) overlay for flair */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-90 mix-blend-multiply">
                        {activeIdx === 2 && ( // Only show on Lounge Chairs to mimic screenshot
                            <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80" alt="Overlay" className="w-2/3 h-2/3 object-contain" />
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="bg-[#162b3c] text-white pt-24 pb-8 overflow-hidden relative">
            <div className="container mx-auto px-8 relative z-10">

                {/* Top Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-32">

                    {/* Newsletter */}
                    <div className="w-full lg:w-1/2">
                        <h3 className="text-3xl font-medium mb-12 tracking-tight">Sign up for our newsletter</h3>
                        <div className="relative max-w-md">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-transparent border-b border-gray-500 py-3 pr-10 focus:outline-none focus:border-white transition-colors text-white placeholder-gray-400"
                            />
                            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors">
                                <ArrowRight size={20} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="w-full lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-8 text-base">
                        <div className="flex flex-col space-y-4">
                            <a href="#" className="hover:text-gray-400 transition-colors">About</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Catalogue</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">FAQ's</a>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <a href="#" className="hover:text-gray-400 transition-colors">Careers</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Clients</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <a href="#" className="hover:text-gray-400 transition-colors">Instagram</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Facebook</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">LinkedIn</a>
                        </div>
                    </div>

                </div>

                {/* Middle Metadata */}
                <div className="flex flex-col md:flex-row justify-between text-xs text-gray-400 mb-16">
                    <div className="flex flex-col space-y-1 mb-4 md:mb-0">
                        <span>Established in 1992</span>
                        <span>&copy; Copyright 2023</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                </div>

                {/* Massive Logo Text */}
                <Reveal direction="up" duration={1500} className="w-full flex justify-center">
                    {/* Using text-[12vw] to make it scale with the screen width perfectly */}
                    <h1 className="text-[12vw] font-bold tracking-tighter leading-none text-white whitespace-nowrap select-none">
                        AMARDEEP DESIGN
                    </h1>
                </Reveal>

            </div>
        </footer>
    );
};

// --- Main Application ---
export default function AmardeepClone() {
    return (
        <div className="font-sans text-[#162b3c] bg-white antialiased selection:bg-[#162b3c] selection:text-white min-h-screen">
            <Header />
            <Hero />
            <StatementSection />
            <CuratedSpaces />
            <MoodboardFeature />
            <InclusionFeature />
            <CategoryShowcase />
            <Footer />
        </div>
    );
}