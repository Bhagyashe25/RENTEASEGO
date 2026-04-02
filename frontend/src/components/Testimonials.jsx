import React from 'react'
import {motion} from 'motion/react'

const Testimonials = () => {
    const testimonials = [
        { date: "Jun 10, 2026", text: "“RentEaseGo helps me rent furniture and home appliances easily, with a fast and smooth experience and a clean, high-quality design.”", name: "James Bond", role: "Amazon.com, Inc.", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" },
        { date: "Jun 10, 2026", text: "“RentEaseGo makes renting furniture and home appliances quick, simple, and user-friendly.”", name: "Emily Rodriguez", role: "The Walt Disney Company", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" },
        { date: "Jun 10, 2026", text: "“With RentEaseGo, I can rent furniture and appliances faster without compromising on design or quality.”", name: "Jack", role: "Facebook, Inc.", img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" },
        { date: "Jul 12, 2026", text: "“RentEaseGo offers a smooth and responsive experience for renting furniture and home appliances”", name: "Sarah Williams", role: "Spotify", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" },
        { date: "Jul 12, 2026", text: "“The app provides a clean design and fast performance, making furniture and appliance rental easy.”", name: "Michael Chen", role: "Google LLC", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" }
    ];

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => prev + 3 >= testimonials.length ? 0 : prev + 3);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => prev - 3 < 0 ? Math.max(testimonials.length - 3, 0) : prev - 3);
    };

    React.useEffect(() => {
        if (!isMobile) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev + 1 >= testimonials.length ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [isMobile, testimonials.length]);
  return (
     <>
            <style>
                {`
                    @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
                    *{
                        font-family: "Poppins", sans-serif;
                    }`
                }
            </style>
            <section className='py-20 px-4 sm:px-6 lg:px-8 bg-amber-50'>
                <div className='w-full max-w-6xl mx-auto'>
                    <h1 className='text-neutral-900 font-medium text-4xl md:text-[40px] text-center md:text-left'>Loved by 10k+ People</h1>
                    <p className='text-neutral-800 text-sm/6 mt-4 max-w-96 text-center md:text-left mx-auto md:mx-0'>Here what they have say about RentEaseGo experience</p>

                    <div className='hidden md:flex justify-end gap-2 mt-4'>
                        <div onClick={handlePrev} className='h-10 w-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-all text-neutral-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                        </div>
                        <div onClick={handleNext} className='h-10 w-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-all text-neutral-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </div>
                    </div>

                    <div className='mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 md:px-0 mt-12 md:mt-6'>
                        {testimonials.slice(currentIndex, isMobile ? currentIndex + 1 : currentIndex + 3).map((item, index) => (
                                <motion.div
                                 initial={{y: 40, opacity: 0}}
                                whileInView={{opacity: 1, y: 0}}
                                  transition={{duration: 0.6, delay: index * 0.2, ease:'easeOut'}}
                                  viewport={{once: true, amount: 0.3}}
                                key={index} className='bg-light hover:-translate-y-1 transition duration-300 border border-zinc-200 rounded-2xl p-6 space-y-6'>
                                    <div className='flex items-start justify-between'>
                                        <div className="flex">
                                            {Array(5).fill(0).map((_, i) => (
                                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                    className="lucide lucide-star text-transparent fill-[#FF8F20]" aria-hidden="true">
                                                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                                </svg>
                                            ))}
                                        </div>
                                        <p className='text-xs text-neutral-500'>{item.date}</p>
                                    </div>

                                    <p className='text-sm/6 text-neutral-600'>{item.text}</p>

                                    <div className='flex items-center gap-4 mt-4'>
                                        <img src={item.img} alt="User Avatar" className='w-13 h-13 rounded-full object-cover'/>
                                        <div>
                                            <p className='text-sm text-neutral-700'>{item.name}</p>
                                            <p className='text-xs font-medium text-neutral-500'>{item.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>
                <div className="hidden max-[768px]:flex items-center justify-center mt-5 space-x-2">
                    {testimonials.map((_, index) => (
                        <span key={index} onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                    ? "bg-neutral-800"
                                    : "bg-neutral-300"
                                }`}
                        ></span>
                    ))}
                </div>
            </section>
        </>
    )
}

export default React.memo(Testimonials);