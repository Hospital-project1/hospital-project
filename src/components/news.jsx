// components/LatestNews.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NewsCard = ({ date, title, description, imageUrl }) => {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
      <div className="relative h-48 w-full">
        <Image 
          src={imageUrl} 
          alt={title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute bottom-2 left-4">
          <button className="bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {date}
        </div>
        <h3 className="font-bold text-xl text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

const LatestNews = () => {
  const newsItems = [
    {
      id: 1,
      date: 'October 18, 2015',
      title: '2015 Best USA Hospitals and Clinics',
      description: 'Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
      imageUrl: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 2,
      date: 'September 22, 2015',
      title: 'Are drugs the best solution?',
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ulla.',
      imageUrl: 'https://images.pexels.com/photos/4058364/pexels-photo-4058364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 3,
      date: 'September 8, 2015',
      title: 'Negative statin stories add to heart health risk',
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ulla.',
      imageUrl: 'https://images.pexels.com/photos/6291261/pexels-photo-6291261.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold uppercase text-gray-800 mb-2">Latest News</h2>
        <div className="w-16 h-1 bg-teal-500 mx-auto mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Read our latest news from the company or general medical news. Feel free to ask questions in
          comments for any news you find interesting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsItems.map((news) => (
          <NewsCard 
            key={news.id}
            date={news.date} 
            title={news.title} 
            description={news.description} 
            imageUrl={news.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default LatestNews;