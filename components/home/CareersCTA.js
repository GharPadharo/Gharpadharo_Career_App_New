import Link from "next/link";

export default function CareersCTA() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary text-white p-6 sm:p-9 lg:px-14 lg:py-11 xl:px-16 xl:py-12 relative overflow-hidden shadow-lg">
          {/* Subtle Decorative Background Wave Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 100% 100%, #ffffff 0%, transparent 60%), radial-gradient(circle at 0% 0%, #ffffff 0%, transparent 50%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="space-y-2.5 sm:space-y-3 text-left max-w-2xl">
              <span className="text-xs sm:text-[13px] font-bold text-[#FDE047] tracking-widest uppercase block">
                WORK WITH US
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[40px] font-extrabold text-white tracking-tight leading-[1.2]">
                Ready to build something meaningful?
              </h2>
              <p className="text-sm sm:text-base lg:text-[17px] text-indigo-100 font-normal leading-relaxed">
                Explore open roles and be part of a team making finding a place simpler for everyone.
              </p>
            </div>

            {/* Right Action Button (Clean, no yellow sparkle, vertically centered) */}
            <div className="shrink-0 w-full sm:w-auto text-left lg:text-right pt-1 lg:pt-0">
              <Link
                href="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-900 text-base font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 text-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Explore Open Roles</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
