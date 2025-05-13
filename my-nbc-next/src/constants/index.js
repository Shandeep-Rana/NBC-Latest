import { jwtDecode as jwt_decode } from 'jwt-decode';

export const BloodGroupOptions = [
  { value: "", label: "Blood Group Type" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

export const EventTypeOptions = [
  { value: "", label: "Event Type" },
  { value: "Virtual", label: "Virtual" },
  { value: "Physical", label: "Physical" },
];


export const StatesAndUnionTerritories = [
  { value: "", label: "Select State" },
  { label: "Andhra Pradesh", value: "AndhraPradesh" },
  { label: "Arunachal Pradesh", value: "ArunachalPradesh" },
  { label: "Assam", value: "Assam" },
  { label: "Bihar", value: "Bihar" },
  { label: "Chhattisgarh", value: "Chhattisgarh" },
  { label: "Goa", value: "Goa" },
  { label: "Gujarat", value: "Gujarat" },
  { label: "Haryana", value: "Haryana" },
  { label: "Himachal Pradesh", value: "HimachalPradesh" },
  { label: "Jharkhand", value: "Jharkhand" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Kerala", value: "Kerala" },
  { label: "Madhya Pradesh", value: "MadhyaPradesh" },
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Manipur", value: "Manipur" },
  { label: "Meghalaya", value: "Meghalaya" },
  { label: "Mizoram", value: "Mizoram" },
  { label: "Nagaland", value: "Nagaland" },
  { label: "Odisha", value: "Odisha" },
  { label: "Punjab", value: "Punjab" },
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Sikkim", value: "Sikkim" },
  { label: "Tamil Nadu", value: "TamilNadu" },
  { label: "Telangana", value: "Telangana" },
  { label: "Tripura", value: "Tripura" },
  { label: "Uttar Pradesh", value: "UttarPradesh" },
  { label: "Uttarakhand", value: "Uttarakhand" },
  { label: "West Bengal", value: "WestBengal" },
  { label: "Andaman and Nicobar Islands", value: "AndamanAndNicobarIslands" },
  { label: "Chandigarh", value: "Chandigarh" },
  { label: "Dadra and Nagar Haveli and Daman and Diu", value: "DadraAndNagarHaveliAndDamanAndDiu" },
  { label: "Delhi", value: "Delhi" },
  { label: "Jammu and Kashmir", value: "JammuAndKashmir" },
  { label: "Ladakh", value: "Ladakh" },
  { label: "Lakshadweep", value: "Lakshadweep" },
  { label: "Puducherry", value: "Puducherry" },
];

export const RegisterRoles = {
  Donor: "donor",
  Volunteer: "volunteer",
  Both: 'both'
};

export const commonPaginatedState = {
  search: "",
  page: 1,
  pagesize: 10,
}

export const emailrgx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

export const pinCodergx = /^[1-9][0-9]{5}$/

export const getUserInfoFromToken = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user");
    if (!data) return null;

    try {
      const parsedData = JSON.parse(data);
      const token = parsedData?.token;
      if (token) {
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        const roleName = parsedData.roleName;
        const email = decodedToken.email;
        const expirationTimeInSeconds = decodedToken.exp;
        const expirationDate = new Date(expirationTimeInSeconds * 1000);
        const expirationTime = expirationDate.toLocaleString();

        return { userId, roleName, email, expirationTime };
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  return null;
};

export const linkedinrgx = /([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?/;
export const facebookrgx = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile\.php\?id=(\d.*))?([\w-]*)?/;
export const youtubergx = /^https?:\/\/(www\.)?youtube\.com\/(channel\/[a-zA-Z0-9_-]+|c\/[a-zA-Z0-9_-]+|user\/[a-zA-Z0-9_-]+|@[a-zA-Z0-9_-]+)(\/.*)?$/;
export const instagramrgx = /\bhttps?:\/\/(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9_]+\/?)\b/;
export const twitterrgx = /^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})\/?$/;

export const rewriteUrl = (url) => {
  // Mapping of special characters to their replacements
  const charMap = {
    ' ': '-20',
    '!': '-21',
    '"': '-22',
    '#': '-23',
    '$': '-24',
    '%': '-25',
    '&': '-26',
    '\'': '-27',
    '(': '-28',
    ')': '-29',
    '*': '-2A',
    '+': '-2B',
    ',': '-2C',
    '/': '-2F',
    ':': '-3A',
    ';': '-3B',
    '<': '-3C',
    '=': '-3D',
    '>': '-3E',
    '?': '-3F',
    '@': '-40',
    '[': '-5B',
    '\\': '-5C',
    ']': '-5D',
    '^': '-5E',
    '_': '-5F',
    '`': '-60',
    '{': '-7B',
    '|': '-7C',
    '}': '-7D',
    '~': '-7E'
  };

  return url.split('').map(char => charMap[char] || char).join('');
};

export const ROLES = {
  Admin: "admin",
  Volunteer: "volunteer",
  SkilledPerson: "skilled person"
};

export const teamMembers = [
  {
    id: 'Rohit-Garg',
    name: 'Rohit Garg',
    role: 'Founder',
    image: "/images/founderImg.jpg",
    description: "Rohit Garg, born in the tranquil village of Bhabour Sahib during the tumultuous era of Emergency rule in India in August 1975, is the visionary founder of our community support website. Raised in a historic setting, Rohit's humble beginnings instilled deep gratitude.",
    social_link: ['https://www.facebook.com/', 'https://www.google.com/', 'https://www.twitter.com/', 'https://www.instagram.com/', 'https://www.linkedin.com/in/rohit-garg-0b342318/'],
    social_icon: ['fab fa-facebook', 'fab fa-google', 'fab fa-x-twitter', 'fab fa-instagram', 'fab fa-linkedin'],
    long_description: `
    <div>
    <h4 style="font-weight:500" class="mt-3">Rohit Garg: Visionary Founder & Community Leader</h4>
    <p>Born in the tranquil village of Bhabour Sahib during the tumultuous era of Emergency rule in India in August 1975, Rohit Garg is the visionary founder of our community support website. Raised in the embrace of history and nature, Rohit's humble beginnings instilled in him a profound sense of gratitude and a commitment to giving back to society.</p>

    <h4 style="font-weight:500" class="mt-3">Roots in Humility & Kindness</h4>
    <p>Growing up in the scenic surroundings of Bhabour Sahib, Rohit's childhood was enriched by the presence of his grandmother (Naani - Smt. Kamla Devi), a revered figure known for her kindness and strength in the village. Her teachings of humility and compassion became the guiding principles of Rohit's life, shaping his character and inspiring his dedication to community service.</p>

    <h4 style="font-weight:500" class="mt-3">Passion for Sports & Eco-Friendly Living</h4>
    <p>In his youth, Rohit's love for cricket mirrored that of many children of his era. Today, his passion for sports endures, albeit in the form of avidly following cricket matches and embracing the eco-friendly pursuit of cycling. Through his commitment to sustainable living, Rohit seeks to leave a positive impact on the environment and inspire others to adopt similar practices.</p>

    <h4 style="font-weight:500" class="mt-3">Life Lessons from Global Experiences</h4>
    <p>Rohit's professional journey has taken him across continents, from Chandigarh to Dubai and Lebanon, where he weathered the storms of political unrest, including the harrowing experience of the July 2006 War between Israel and Lebanon. These experiences not only enriched his professional acumen but also imparted invaluable life lessons in crisis management and resilience.</p>

    <h4 style="font-weight:500" class="mt-3">Leadership in Finance & Business</h4>
    <p>As a seasoned financial professional, Rohit currently serves as the Chief Financial Officer for the Al Habtoor Group, a prestigious multinational conglomerate based in the United Arab Emirates. In this role, he oversees the financial operations of the company across multiple locations, playing a pivotal role in shaping its financial strategy and ensuring its continued success.</p>

    <h4 style="font-weight:500" class="mt-3">A Legacy of Leadership & Integrity</h4>
    <p>Throughout his career, Rohit has been lauded for his exemplary leadership and unwavering commitment to financial stability. His integrity, coupled with his astute financial acumen, has earned him the respect and admiration of colleagues, industry peers, and partners alike.</p>

    <p>Through his steadfast dedication to community service and his tireless efforts to make a positive difference in the world, Rohit Garg embodies the spirit of compassion, resilience, and leadership, inspiring us all to strive for a better tomorrow.</p>
</div>
    `
  },
  {
    id: 'Lakshya-Garg',
    name: 'Lakshya Garg',
    role: 'Co-Founder & Junior Developer',
    image: "/images/lakshayImg.jpg",
    description: 'Lakshya Garg, born in the vibrant city of Beirut in 29th January 2013, is young and dynamic force behind our community support website. At just 11 years old, Lakshya embodies zest for life and a determination to make a positive impact in the world around him.',
    long_description: `
    <div>
    <h4 style="font-weight:500" class="mt-3">Lakshya Garg: A Young and Dynamic Force</h4>
    <p>Born in the vibrant city of Beirut on January 29, 2013, Lakshya Garg is the young and dynamic force behind our community support website. At just 11 years old, Lakshya embodies a zest for life and a determination to make a positive impact in the world around him.</p>

    <h4 class="mt-3" style="font-weight:500">Passionate Learner & Coder</h4>
    <p>With a keen interest in technology, Lakshya has delved into the world of coding over the past three years. His curiosity and dedication have led him to become an integral part of our development team, where he lends his skills and enthusiasm to create meaningful tools for our community.</p>

    <h4 class="mt-3" style="font-weight:500">Basketball Enthusiast</h4>
    <p>Beyond his love for coding, Lakshya finds joy in playing games with friends, with NBA basketball holding a special place in his heart. He hones his skills at the local Basketball Academy, where he learns the value of teamwork and discipline.</p>

    <h4 class="mt-3" style="font-weight:500">Environmental Advocate</h4>
    <p>Driven by a desire to contribute to a cleaner and quieter environment, Lakshya is passionate about reducing pollution, including the unnecessary noise pollution caused by incessant honking on Indian roads. He believes in taking proactive steps to preserve Mother Nature for future generations.</p>

    <h4 class="mt-3" style="font-weight:500">Gourmet Explorer</h4>
    <p>In his downtime, Lakshya indulges in his favorite foods, which include pizza and Manakeesh (Lebanese pizza), along with a side of hummus. His culinary adventures reflect his adventurous spirit and appreciation for diverse cultures.</p>

    <h4 class="mt-3" style="font-weight:500">Academic Journey</h4>
    <p>Currently a Year IB 6 student, Lakshya eagerly anticipates the start of high school in September 2024, where he plans to continue his academic pursuits alongside his commitment to making a difference in the community.</p>

    <p>Through his dedication, creativity, and unwavering passion, Lakshya inspires us all to strive for excellence and to create a brighter future for generations to come.</p>
</div>
    `
  },
  {
    id: 'Lavanya-Garg',
    name: 'Lavanya Garg',
    role: 'Co-founder & Creative Designer',
    image: "/images/lavanyaImg.jpg",
    description: 'Lavanya Garg, budding teenager who turned thirteen in September 2023, is vital force behind our community support website. Born in the historic city of Byblos, Lebanon, Lavanya brings blend of creativity and passion to our team, enriching our endeavors with her unique perspective.',
    long_description: `
    <div>
    <h4 class="mt-3" style="font-weight:500">Lavanya Garg: A Vital Force & Budding Teenager</h4>
    <p>Lavanya Garg, a budding teenager who turned thirteen in September 2023, is a vital force behind our community support website. Born in the historic city of Byblos, Lebanon, Lavanya brings a blend of creativity and passion to our team, enriching our endeavors with her unique perspective.</p>

    <h4 class="mt-3" style="font-weight:500">Passionate Artist & Crafter</h4>
    <p>From a young age, Lavanya has been captivated by the world of art and craft. Her self-driven learning and exploration have fostered a deep appreciation for creativity, which she channels into every aspect of her life. As our resident creative designer, Lavanya infuses our website with her artistic flair, shaping its identity and enhancing its visual appeal.</p>

    <h4 class="mt-3" style="font-weight:500">Social Butterfly & Volleyball Enthusiast</h4>
    <p>With a natural inclination towards social interaction, Lavanya thrives on meaningful conversations and connections. Alongside her friends, she finds joy in engaging discussions and shared experiences. Volleyball holds a special place in Lavanya's heart, and she dedicates her time to honing her skills at the local academy, where she learns valuable lessons in teamwork and perseverance.</p>

    <h4 class="mt-3" style="font-weight:500">Environmental Advocate</h4>
    <p>Driven by a deep-seated commitment to environmental conservation, Lavanya advocates for a paperless future and sustainable transportation options. She believes in the importance of preserving nature for future generations and actively promotes initiatives such as reducing paper usage and encouraging the use of public transport or bicycles.</p>

    <h4 class="mt-3" style="font-weight:500">Academic Pursuits & Love for Music</h4>
    <p>Currently an enthusiastic Year IB 8 student, Lavanya embraces the opportunity to learn and grow each day. Her insatiable curiosity fuels her passion for education, as she eagerly explores new topics and ideas. In her free time, Lavanya finds solace in music, which serves as a source of inspiration and relaxation amidst her busy schedules.</p>

    <p>Through her artistic vision, dedication to environmental stewardship, and unwavering commitment to community support, Lavanya embodies the spirit of innovation and compassion, inspiring us all to strive for a brighter, more sustainable future.</p>
</div>

    `
  },
  {
    id: "Karan-Chaudhary",
    name: "Karan Chaudhary",
    role: "Brand Ambassador - NBC",
    image: "/images/karanImg.jpg",
    description: "Meet Karan Chaudhary, dedicated pharmacist born on February 22, 1991, who has been running his family-owned pharmacy since 1984 alongside his father. However, Karan's impact extends far beyond his professional life. Karan's commitment to community service has earned him recognition as the District Organising Secretary of RDCA. He has also been awarded by the Government of Punjab as a Covid Warrior for his selfless service during the pandemic.",
    long_description: `<h4 style="font-weight:500">Pharmacist with Passion for Sports and Community Service </h4> 
    <p>Meet Karan Chaudhary, dedicated pharmacist born on February 22, 1991, who has been running his family- owned pharmacy since 1984 alongside his father.However, Karan's impact extends far beyond his professional life.</p>

    <div class="mt-3">
 <h4 style="font-weight:500">A Sports Enthusiast</h4>
<p>In his free time, Karan enjoys playing golf and cycling, which reflects his love for fitness and the outdoors.This passion has also driven him to organize various sports events, including:</p>

<ul class="m-0">
<li>Bhakra Nangal Wheels and Stride: Punjab's largest cyclothon and marathon event</li>
<li>Pedal of Honour: Punjab's biggest online cycling event</li>
<li>Numerous marathons and sports events promoting community participation</li>
</ul>
</div>

<div class="mt-3">
<h4 style="font-weight:500">Recognized Community Leader</h4>
<p>Karan's commitment to community service has earned him recognition as the District Organising Secretary of RDCA. He has also been awarded by the Government of Punjab as a Covid Warrior for his selfless service during the pandemic.</p>
</div>

<div class="mt-3">
<h4 style="font-weight:500">Dedicated Activist</h4>
<h6>Karan is consistent promoter and supporter of events focused on:</h6>

<ul class="m-0">
<li>Sports and fitness</li>
<li>People awareness and education</li>
<li>Plantation and environmental conservation Promoting Nangal By Cycle As Brand Ambassador, Karan is excited to promote Nangal By Cycle, website that aligns with his values and passions.Through this partnership, he aims to inspire others to adopt a healthy and sustainable lifestyle.With his unique blend of professional expertise, sports enthusiasm, and community spirit, Karan Chaudhary is an inspiring individual making a positive impact in his community.</li>
</ul>
</div>

<div class="mt-3">
<h4 style="font-weight:500">Promoting Nangal By Cycle</h4>
<div>
<p>
As Brand Ambassador, Karan is excited to promote <b>Nangal By Cycle</b>, website that aligns with his values and passions. Through this partnership, he aims to inspire others to adopt a healthy and sustainable lifestyle.
With his unique blend of professional expertise, sports enthusiasm, and community spirit, Karan Chaudhary is an inspiring individual making a positive impact in his community.
</p>
</div>
`

  },
  {
    id: 'Tarun-Kumar',
    name: 'Tarun Kumar',
    role: 'Director – Legal & Compliance',
    image: "/images/tarunImg.jpg",
    description: 'Tarun, distinguished law graduate from the prestigious Panjab University, Chandigarh, is specialist in Real Estate transactions. Renowned for his go-getter approach and disciplined work ethic, Tarun brings exceptional energy and dedication to his legal practice. With extensive experience in court proceedings and legal drafting, he effectively represents corporates and builders, making him a powerhouse in the legal field.',
    long_description: `<div>
    <p>Tarun, distinguished law graduate from the prestigious Panjab University, Chandigarh, is specialist in Real Estate transactions. Renowned for his go-getter approach and disciplined work ethic, Tarun brings exceptional energy and dedication to his legal practice. With extensive experience in court proceedings and legal drafting, he effectively represents corporates and builders, making him a powerhouse in the legal field.
Beyond his professional achievements, Tarun is a nature lover and avid cyclist. He channels his passion for cycling into his dynamic and energetic legal practice, demonstrating the same enthusiasm and commitment in both arenas. Additionally, Tarun is a talented photographer, capturing the beauty of nature through his lens. His unique blend of legal expertise, passion for the outdoors, and artistic talent make him an invaluable asset to our community support team.</p>
    </div>`,
  },
  {
    id: 'Ajay-bansal',
    name: 'Ajay Bansal',
    role: "Director - Content and Creativity",
    image: "/images/ajayImg.jpg",
    description: "With over 25 years of experience in the graphic design industry, Ajay has mastered the art of transforming concepts into impactful visual experiences. Specializing in branding, print design, and digital media, he has built diverse portfolio across sectors like corporate, retail, healthcare, education, and non-profits.",
    long_description: `<div><p>With over 25 years of experience in the graphic design industry, 
    Ajay has mastered the art of transforming concepts into impactful visual experiences. 
    Specializing in branding, print design, and digital media, he has built diverse portfolio across sectors like corporate, retail, 
    healthcare, education, and non-profits. Ajay has worked with renowned brands and small businesses alike, 
    helping them establish and elevate their visual identities.Known for his keen eye for detail, innovative design thinking, 
    and ability to stay ahead of trends, Ajay consistently delivers solutions that are both visually stunning and effective in driving engagement 
    and results. His wide-ranging expertise spans logo design, typography, web design, and user interface (UI) development. 
    Whether leading Creative Team or working independently, Ajay brings blend of technical expertise and artistic flair to every project, 
    ensuring a cohesive visual message that resonates with target audiences.In addition to his design work, 
    Ajay is passionate about mentoring the next generation of designers and sharing insights on industry trends, 
    software advancements, and design theory. His career is marked by continuous learning and innovation, 
    making him an invaluable asset to our community support website project.</p></div>`
  },
  {
    id: 'Naresh',
    name: 'Naresh',
    role: "Dr. Naresh | Director - Health and Wellness",
    image: "/images/nareshImg.jpg",
    description: `
    Dr. Naresh, highly respected medical professional, has dedicated his career to public healthcare. He served as the Head of the Government Hospital in Nangal, Punjab, where he played pivotal role in improving the medical infrastructure and providing exceptional healthcare services to the local community. His leadership and commitment to patient care have earned him widespread recognition.

 

Dr. Naresh has been instrumental in modernizing the hospital's facilities, introducing advanced medical practices, and ensuring that the hospital meets the growing needs of the region. His expertise spans various aspects of healthcare management, and his hands-on approach to treating patients has made him a beloved figure in Nangal Area.

    `,
    long_description: `
    <div>
    <p>
    Dr. Naresh, highly respected medical professional, has dedicated his career to public healthcare. He served as the Head of the Government Hospital in Nangal, Punjab, where he played pivotal role in improving the medical infrastructure and providing exceptional healthcare services to the local community. His leadership and commitment to patient care have earned him widespread recognition.
Dr. Naresh has been instrumental in modernizing the hospital's facilities, introducing advanced medical practices, and ensuring that the hospital meets the growing needs of the region. His expertise spans various aspects of healthcare management, and his hands-on approach to treating patients has made him a beloved figure in Nangal Area.
Although now retired, Dr. Naresh continues to remain active in community health initiatives, sharing his wealth of experience to mentor young doctors and contribute to health awareness campaigns. His dedication to public service and his profound impact on Nangal’s healthcare system leave lasting legacy.
    </p>
    </div>
    `
  },
  {
    id: 'Abhishek',
    name: 'Abhishek',
    role: "Explorer-in-Chief",
    image: "/images/abhishekImg.jpg",
    "description": "Abhishek, the founder of the popular Instagram handle @primetime_with_abhishek, is a passionate content creator dedicated to showcasing the rich cultural heritage and scenic beauty of the Nangal region. As Explorer-in-Chief, he brings his expertise in digital storytelling and community outreach to highlight and preserve the essence of Punjab’s traditions, events, and landscapes.",
    "long_description": `<div><p>We are thrilled to welcome Abhishek, the founder of the popular Instagram handle @primetime_with_abhishek, to the Nangal by Cycle core team as our Explorer-in-Chief.  
    <br/><br/>
    Hailing from Bhabour Sahib, Abhishek is a dedicated content creator committed to promoting the rich cultural heritage and scenic beauty of the Nangal region. Through his engaging content, he passionately captures the essence of Punjab's traditions, events, and landscapes, helping to spread awareness and appreciation for the local culture.  
    <br/><br/>
    His deep-rooted connection to the community is evident in his work, having showcased various facets of Nangal, including the historic Bhado Ashtmi Mela at Sri Bhabour Sahib. Abhishek's dedication to social work and community engagement aligns perfectly with the mission of Nangal by Cycle, making him a valuable addition to our team.  
    <br/><br/>
    As Explorer-in-Chief, Abhishek will lead initiatives to explore and document the hidden gems of our region, inspiring both locals and visitors to appreciate and preserve our heritage. His expertise in digital storytelling and community outreach will play a crucial role in driving our vision forward.  
    <br/><br/>
    We look forward to the exciting journeys and stories that Abhishek will bring to the Nangal by Cycle community, further strengthening our efforts to celebrate and protect our cultural and natural heritage.</p></div>`
  },
  {
    id: 'Ramesh Chandra Singh',
    name: 'Ramesh Chandra Singh',
    role: "Mentor",
    image: "/images/rameshImg.png",
    description: "Ramesh Chandra Singh is a seasoned security expert and former IPS officer with over 30 years of global experience in high-risk environments. Currently serving as the United Nations Security Adviser for Sri Lanka and Maldives, he brings a wealth of expertise in crisis management, counter-terrorism, and leadership.",
    long_description: `<div><p>We are honored to welcome Ramesh Chandra Singh to the Nangal by Cycle core team as a Mentor.  
    <br/><br/>
    Currently serving as the United Nations Security Adviser for Sri Lanka and Maldives, Ramesh brings over three decades of experience in international security and crisis response. His career has taken him to some of the world’s most challenging regions, including Sierra Leone, Darfur, South Sudan, Lebanon, Nigeria, Yemen, Azerbaijan, and Bangladesh.  
    <br/><br/>
    Before joining the UN, Ramesh served 20 years in the Punjab cadre of the Indian Police Service (IPS), specializing in crime prevention, anti-corruption, counter-terrorism, and close protection. A notable highlight of his service includes leading the Close Protection Team for former Indian Prime Minister Atal Bihari Vajpayee.  
    <br/><br/>
    Beyond his professional accomplishments, Ramesh is a passionate advocate for physical fitness. Between 2013 and 2023, he completed an astounding 101 half-marathons across all six continents. In his free time, he enjoys tennis, badminton, squash, reading, hiking, camping, wildlife photography, and socializing.  
    <br/><br/>
    His multifaceted expertise, discipline, and global perspective make him a valuable guide and mentor for our community. We are excited to benefit from his leadership, insights, and unwavering dedication to excellence.</p></div>`
  }
];
