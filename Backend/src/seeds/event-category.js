/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries in the table
  await knex('event_category').del();
  
  // Inserts seed entries
  await knex('event_category').insert([
    { category_id: 1, category_name: 'Competition', description: 'Events involving competitive activities or challenges.' },
    { category_id: 2, category_name: 'Awareness', description: 'Events aimed at raising awareness (e.g., Mandir Arti).' },
    { category_id: 3, category_name: 'Bike Ride', description: 'Outdoor physical events like biking or walking.' },
    { category_id: 4, category_name: 'Get-together', description: 'Digital or physical social events to bring people together.' },
    { category_id: 5, category_name: 'Art Submission', description: 'Events requiring participants to submit artwork, photos, or videos.' },
    { category_id: 6, category_name: 'Education', description: 'Events aimed at teaching or informing participants about a subject.' },
    { category_id: 7, category_name: 'Health & Wellness', description: 'Events promoting physical or mental well-being (e.g., yoga, fitness workshops).' },
    { category_id: 8, category_name: 'Job Opportunity', description: 'Events related to job fairs, career counseling, or recruitment.' },
    { category_id: 9, category_name: 'Webinar', description: 'Virtual events hosted online for discussions, workshops, or seminars.' },
    { category_id: 10, category_name: 'Conference', description: 'Larger-scale formal gatherings, often industry-specific.' },
    { category_id: 11, category_name: 'Music & Dance', description: 'Events centered around performances, concerts, or dance.' },
    { category_id: 12, category_name: 'Sports', description: 'Athletic events or competitions, both casual and professional.' },
    { category_id: 13, category_name: 'Charity', description: 'Events aimed at raising funds or awareness for charitable causes.' },
    { category_id: 14, category_name: 'Networking', description: 'Events designed to help people connect professionally or socially.' },
    { category_id: 15, category_name: 'Environmental Awareness', description: 'Events aimed at promoting environmental causes, sustainability, etc.' },
    { category_id: 16, category_name: 'Religious', description: 'Events related to religious activities like ceremonies, prayers, or festivals.' },
    { category_id: 17, category_name: 'Technology', description: 'Events focused on technological advancements, workshops, or meetups.' },
    { category_id: 18, category_name: 'Photography', description: 'Events or competitions related to photography or visual arts.' },
    { category_id: 19, category_name: 'Cooking & Food', description: 'Events centered around cooking, food festivals, or culinary competitions.' },
    { category_id: 20, category_name: 'Book Club & Literature', description: 'Events related to reading, writing, or literature discussions.' },
    { category_id: 21, category_name: 'Public Speaking', description: 'Events or workshops aimed at improving speaking or presentation skills.' },
    { category_id: 22, category_name: 'Science & Innovation', description: 'Events focusing on scientific discoveries, innovations, and research.' },
    { category_id: 23, category_name: 'Personal Development', description: 'Events that focus on self-improvement, motivation, or life coaching.' },
    { category_id: 24, category_name: 'Gaming', description: 'Events related to video games, e-sports, or tabletop gaming.' },
    { category_id: 25, category_name: 'Film Screening', description: 'Events showing films or organizing movie nights, followed by discussions.' },
    { category_id: 26, category_name: 'Politics & Civic Engagement', description: 'Events aimed at discussing politics or promoting civic engagement.' },
    { category_id: 27, category_name: 'Pet & Animal Care', description: 'Events related to pet care, adoption drives, or animal welfare.' },
    { category_id: 28, category_name: 'History & Culture', description: 'Events focused on learning about historical events or cultural heritage.' },
    { category_id: 29, category_name: 'Travel & Adventure', description: 'Events involving travel groups, adventures, or exploratory trips.' },
    { category_id: 30, category_name: 'Entrepreneurship', description: 'Events focused on starting and running businesses, including workshops and talks.' },
  ]);
};
