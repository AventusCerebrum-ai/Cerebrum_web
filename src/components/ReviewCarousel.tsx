import React from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { title } from "process";


// This creates the illusion of more content and a continuous experience
const reviews = [
  // Add more unique reviews to create a longer sequence
  {
    quote:
      "As a healthcare administrator, I've seen CerebrumAI dramatically reduce unnecessary referrals while improving patient satisfaction scores.",
    author: "Abhang Pawar",
    title: "Healthcare Administrator",
    image: "/abhang.jpeg"
  },
  {
    quote:
      "The AI-powered triage system is incredibly accurate. It's helped our clinic prioritize cases more effectively than any system we've used before.",
    author: "Arnav Angarkar",
    title: "Clinical Director",
    image: "/arnav.jpeg"
  },
  {
    quote:
      "The platform's ability to integrate with our existing systems made adoption seamless. Our staff adapted to it within days.",
    author: "Ankit Dash",
    title: "IT Healthcare Specialist",
    image: "/ankit.jpeg"
  },
  {
    quote:
      "CerebrumAI's solutions have not only improved our workflow but also enhanced the quality of care we provide to our patients.",
    author:"Gourav Purohit",
    title: "Healthcare Consultant",
    image: "/gourav.jpeg"
  }
];

const ReviewCarousel: React.FC = () => {
  const [current, setCurrent] = React.useState(0);
  const [api, setApi] = React.useState<any>(null);
  
  // Track direction of carousel movement for animation purposes
  const [direction, setDirection] = React.useState(0);
  const prevIndex = React.useRef(0);

  // Update current index when carousel scrolls
  React.useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      const selectedIndex = api.selectedScrollSnap();
      setDirection(selectedIndex > prevIndex.current ? 1 : -1);
      prevIndex.current = selectedIndex;
      setCurrent(selectedIndex);
    });
    
    // Cleanup
    return () => {
      api.off("select");
    };
  }, [api]);

  // Function to handle manual navigation
  const handleNavigation = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  // Handle next specifically to manage the continuous experience
  const handleNext = () => {
    if (!api) return;
    setDirection(1);
    api.scrollNext();
  };

  // Handle previous specifically to manage the continuous experience
  const handlePrev = () => {
    if (!api) return;
    setDirection(-1);
    api.scrollPrev();
  };

  return (
    <section className="relative z-10 px-4 md:px-8 transition-colors">
      <div className="relative h-screen flex items-center justify-center overflow-hidden py-10 md:py-14 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="w-full">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-8 animate-fade-in">
            <h3 className="mb-2 text-2xl md:text-3xl font-semibold text-gradient-primary">What People Are Saying</h3>
            
            <Carousel
              className="w-full"
              opts={{
                align: "center",
                loop: true,
                skipSnaps: false,
                dragFree: false,
              }}
              setApi={setApi}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {reviews.map((review, index) => (
                  <CarouselItem 
                    key={index} 
                    className="pl-2 md:pl-4 sm:basis-4/5 md:basis-2/3 lg:basis-1/2 transition-all duration-500"
                  >
                    <div className={`
                      px-7 py-9 transition-all duration-500 
                      flex flex-col items-center gap-5 min-h-[244px]
                      transform
                      ${index === current 
                        ? "scale-110 opacity-100 z-10" 
                        : index === (current + 1) % reviews.length || (current === reviews.length - 1 && index === 0)
                          ? "scale-90 opacity-60 blur-[2px] z-0 translate-x-4" 
                          : index === (current - 1 + reviews.length) % reviews.length || (current === 0 && index === reviews.length - 1)
                          ? "scale-90 opacity-60 blur-[2px] z-0 -translate-x-4"
                          : "scale-80 opacity-0 z-0"}
                    `}>
                      <span className="text-[62px] leading-none text-gradient-primary -mt-6">"</span>
                      <span className="text-lg md:text-xl text-gray-700 dark:text-gray-200 font-medium min-h-[54px]">
                        {review.quote}
                      </span>
                      <div className="flex items-center gap-4 mt-4">
                        <img
                          src={review.image}
                          alt={review.author}
                          className={`h-12 w-12 rounded-full shadow-md object-cover transition-all duration-500 ${
                            index === current ? "border-2 border-[#64d0d5]" : "border border-fuchsia-300/30"
                          }`}
                        />
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-primary text-[16px]">{review.author}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-300">{review.title}</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="flex items-center justify-center gap-4 mt-8">
                <CarouselPrevious 
                  className="!static h-8 w-8 p-2 bg-primary/10 hover:bg-fuchsia-200/40 border-none transition" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePrev();
                  }}
                />
                
                <CarouselNext 
                  className="!static h-8 w-8 p-2 bg-primary/10 hover:bg-fuchsia-200/40 border-none transition" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewCarousel;
