"use client";

export default function LoadingSkeleton() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 p-8">

      <div className="mx-auto max-w-7xl animate-pulse">

        {/* HEADER */}

        <div className="mb-10 space-y-4">

          <div className="h-10 w-72 rounded-xl bg-slate-800" />

          <div className="h-4 w-52 rounded bg-slate-800" />

        </div>

        {/* PROFILE */}

        <div className="rounded-3xl border border-cyan-500/10 bg-slate-900/60 p-8">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

            {/* Avatar */}

            <div className="h-36 w-36 rounded-full bg-slate-800" />

            {/* Info */}

            <div className="flex-1">

              <div className="mb-3 h-8 w-56 rounded bg-slate-800" />

              <div className="mb-8 h-4 w-40 rounded bg-slate-800" />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                {[1,2,3,4].map((i)=>(
                  <div
                    key={i}
                    className="rounded-2xl bg-slate-800 p-5"
                  >
                    <div className="mb-3 h-4 w-24 rounded bg-slate-700" />
                    <div className="h-8 w-16 rounded bg-slate-700" />
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {Array.from({ length: 8 }).map((_, i) => (

            <div
              key={i}
              className="rounded-3xl border border-cyan-500/10 bg-slate-900/60 p-6"
            >
              <div className="mb-4 flex items-center justify-between">

                <div>

                  <div className="mb-3 h-4 w-24 rounded bg-slate-800" />

                  <div className="h-8 w-20 rounded bg-slate-800" />

                </div>

                <div className="h-14 w-14 rounded-2xl bg-slate-800" />

              </div>

              <div className="h-2 rounded bg-slate-800" />

            </div>

          ))}

        </div>

        {/* CONTENT */}

        <div className="mt-8 grid gap-8 xl:grid-cols-3">

          {/* Chart */}

          <div className="rounded-3xl border border-cyan-500/10 bg-slate-900/60 p-6 xl:col-span-2">

            <div className="mb-8">

              <div className="mb-3 h-7 w-56 rounded bg-slate-800" />

              <div className="h-4 w-44 rounded bg-slate-800" />

            </div>

            <div className="h-[400px] rounded-2xl bg-slate-800" />

          </div>

          {/* Achievement */}

          <div className="rounded-3xl border border-cyan-500/10 bg-slate-900/60 p-6">

            <div className="mb-8">

              <div className="mb-3 h-7 w-44 rounded bg-slate-800" />

              <div className="h-4 w-36 rounded bg-slate-800" />

            </div>

            <div className="space-y-4">

              {Array.from({ length: 8 }).map((_, i) => (

                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl bg-slate-800 p-4"
                >
                  <div className="flex items-center gap-4">

                    <div className="h-12 w-12 rounded-xl bg-slate-700" />

                    <div>

                      <div className="mb-2 h-4 w-28 rounded bg-slate-700" />

                      <div className="h-3 w-20 rounded bg-slate-700" />

                    </div>

                  </div>

                  <div className="h-6 w-16 rounded bg-slate-700" />

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Recent Matches */}

        <div className="mt-8 rounded-3xl border border-cyan-500/10 bg-slate-900/60 p-6">

          <div className="mb-8">

            <div className="mb-3 h-7 w-48 rounded bg-slate-800" />

            <div className="h-4 w-36 rounded bg-slate-800" />

          </div>

          <div className="space-y-4">

            {Array.from({ length: 5 }).map((_, i) => (

              <div
                key={i}
                className="rounded-2xl bg-slate-800 p-5"
              >
                <div className="grid gap-5 xl:grid-cols-6">

                  {Array.from({ length: 6 }).map((_, j) => (

                    <div
                      key={j}
                      className="space-y-3"
                    >
                      <div className="h-4 w-16 rounded bg-slate-700" />

                      <div className="h-6 w-20 rounded bg-slate-700" />
                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  );
}