import React from 'react';

export const Values = () => {
  return (
    <section className='py-20 bg-primary/10 leading-relaxed tracking-wide'>
      <div className='container'>
        <h1 className='text-3xl leading-tight tracking-tight sm:text-4xl '>
          Our Mission
        </h1>
        <p className='mt-8 text-base  text-pretty max-w-3xl '>
        To empower kitchens around the world by providing a comprehensive, easy-to-use labeling solution that prioritizes food safety, streamlines kitchen operations, and promotes efficient management. We are dedicated to continuously innovating to meet the evolving needs of kitchens and restaurants everywhere.
        </p>
        <div className='basis-full lg:basis-1/2 flex flex-col items-start mt-12'>
          <p className='text-2xl md:text-3xl font-medium'>Our Vision</p>
          <p className='mt-2 text-base sm:text-xl text-muted-foreground font-light'>
            We envision a world where:
          </p>
          <ul className='mt-8 gap-4 text-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            <li className='p-6 border border-primary border-dashed rounded-lg bg-primary/10'>
              <strong>Food Safety is Prioritized: </strong>
              By focusing on smart labeling and ingredient management, we help kitchens avoid food safety risks, ensuring healthier dining experiences and longer-lasting food products.
            </li>
            <li className='p-6 border border-primary border-dashed rounded-lg'>
              <strong>Efficient Kitchen Operations are Achieved: </strong>
              We empower restaurant owners and kitchen managers with the tools they need to make informed decisions and streamline their ingredient tracking and labeling processes.
            </li>
            <li className='p-6 border border-primary border-dashed rounded-lg bg-primary/10'>
              <strong>Sustainability and Waste Reduction are Key:</strong>
              We believe in minimizing food waste through better tracking of expiry dates, enabling kitchens to optimize their operations and reduce unnecessary loss.
            </li>
            <li className='p-6 border border-primary border-dashed rounded-lg'>
              <strong>Quality Labeling Solutions are Accessible:  </strong>
              We strive to make high-quality, user-friendly labeling systems accessible to kitchens of all sizes, regardless of budget or location.
            </li>
          </ul>
        </div>
        <div className='basis-full lg:basis-1/2 flex flex-col items-start mt-12'>
          <p className='text-2xl md:text-3xl font-medium'>Our Values</p>
          <ul className='mt-8 gap-4 text-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            <li className='p-6 border border-primary border-dashed rounded-lg'>
              <strong>Efficiency: </strong>
              We prioritize creating easy-to-use, reliable solutions that save time and improve kitchen management for our users.
            </li>
            <li className='p-6 border border-primary border-dashed rounded-lg bg-primary/10'>
              <strong>Integrity:</strong>
              We operate with transparency and reliability, ensuring that kitchens trust our solution to manage their ingredients safely.

            </li>
            <li className='p-6 border border-primary border-dashed rounded-lg bg-primary/20'>
              <strong>Innovation: </strong>
              We are committed to continually enhancing our labeling solution with the latest technology to meet the evolving needs of the food industry.

            </li>
            <li className='p-6 border border-primary border-dashed rounded-lg bg-primary/10'>
              <strong> Inclusivity: </strong>
              We believe every kitchen, from small startups to large restaurant chains, deserves access to the best labeling technology to ensure food safety and customer satisfaction.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
