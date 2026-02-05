import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const ImageFinder = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("nature");
  const [loading, setLoading] = useState(false);

  const fetchImages = useCallback( async () => {
    setLoading(true);

    try {
        const options = {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        };

        const url = `https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=12`;
        const response = await fetch(url, options)

        if(!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        setPhotos(prev => page === 1 ? data.photos : [...prev, ...data.photos]);
    } catch (error) {
        console.error(`Error while fetching images: ${error}`);
        toast('Error while fetching images');
    } finally {
        setLoading(false);
    }
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.search.value.trim();

    setPhotos([]);
    setPage(1);
    setQuery(value);
  }

  useEffect(() => {
    fetchImages();
  }, [fetchImages])
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      {/* Hero section */}
      <section className="px-4 pt-20 pb-16 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-sm text-amber-700">
          📷 Powered by Pexels
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Image <span className="text-amber-600">Finder</span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Discover stunning high-quality photos from Pexels. Search, browse, and
          download images for your projects.
        </p>

        {/* search */}
        <form 
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-2xl items-center rounded-xl bg-white shadow-lg"
        >
          <div className="flex items-center px-4 text-slate-400 text-xl">
            🔍
          </div>
          <input
            type="text"
            name="search"
            placeholder="Search for images..."
            className="flex-1 bg-transparent px-2 py-4 text-slate-800 outline-none"
          />
          <button
            type="submit"
            className="m-2 rounded-lg bg-amber-300 px-6 py-2 font-medium text-slate-900 transition hover:bg-amber-500"
          >
            Search
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-500">
          Showing result for{" "}
          <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">
            {query}
          </span>
        </div>
      </section>

      {/* Content section */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        {/* Empty state */}
        {!loading && photos.length === 0 && (
            <div className="mt-20 flex flex-col items-center text-center text-slate-500">
            <div className="mb-4 rounded-lg bg-slate-200 p-6">🚫</div>
            <h3 className="text-lg font-medium text-slate-700">
                No images found
            </h3>
            <p className="mt-1 max-w-sm text-sm">
                Try searching for something else or adjust your search terms.
            </p>
            </div>
        )}

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map(photo => (
                <div key={photo.id} className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg">
                    <img 
                        src={photo.src.medium} 
                        alt={photo.alt} 
                        className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="p-4">
                        <p className="mb-3 truncate text-sm text-slate-600">📸 {photo.photographer}</p>

                        <a 
                            href={photo.src.original} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-md bg-slate-800 py-2 text-center text-sm text-white transition hover:bg-slate-700"
                        >
                            Download
                        </a>
                    </div>
                </div>
            ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="mt-10 text-center text-slate-500">Loading images...</p>
        )}

        {/* Load more */}
        {!loading && photos.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="rounded-lg bg-slate-800 px-6 py-2 text-white transition hover:bg-slate-600"
            >
              Load more
            </button>
          </div>
        )}
      </section>
      <ToastContainer />
    </main>
  );
};

export default ImageFinder;
