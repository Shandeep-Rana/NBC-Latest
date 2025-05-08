'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbLogs } from 'react-icons/tb';

const navItems = [
    { href: '/admin/blooddonor/donorlist', icon: 'fa-solid fa-list', label: 'Donor List' },
    { href: '/admin/bloodrequirement/bloodrequirementlist', icon: 'fa-solid fa-droplet', label: 'Blood Requirement List' },
    { href: '/admin/volunteer/volunteerlist', icon: 'fa-solid fa-address-card', label: 'Volunteer list' },
    { href: '/admin/nbcmember/memberlist', icon: 'fas fa-graduation-cap', label: 'NBC Members' },
    { href: '/admin/nangalheros/nangalheroslist', icon: 'fa-sharp fa-solid fa-star-half-stroke', label: 'Nangal Heroes' },
    { href: '/admin/event/eventlist', icon: 'fa-solid fa-list', label: 'Events List' },
    { href: '/admin/event/requestedeventlist', icon: 'fa-solid fas fa-tasks', label: 'Pending Events Request' },
    { href: '/admin/event/eventparticipants', icon: 'fa-solid fas fa-users', label: 'Event Participants' },
    { href: '/admin/blog/bloglist', icon: 'fa-solid fa-pen', label: 'Blogs' },
    { href: '/admin/news/newslist', icon: 'fa-solid fa-newspaper', label: 'News' },
    { href: '/admin/gallerylist', icon: 'fa-solid fa-image', label: 'Gallery' },
    { href: '/admin/contactlist', icon: 'fa-solid fa-exchange-alt', label: 'Contact Requests' },
    { href: '/admin/faqlist', icon: 'fa-solid fa-question-circle', label: 'Faq' },
    { href: '/admin/audit-logs', reactIcon: <TbLogs />, label: 'Audit Logs' },
    { href: '/admin/feedbacklist', icon: 'fa-solid fa-comments', label: 'FeedBacks' }
];

export default function AdminSideBar() {
    const pathname = usePathname();

    return (
        <div
            className="col-md-3 col-lg-3 bg-dark position-sticky pl-0 border-top admin_sidebar"
            role="navigation"
            style={{ height: '100vh' }}
        >
            <nav className="nav flex-column sidebar_admin pl-0 mt-3 text-uppercase">
                {navItems.map(({ href, icon, reactIcon, label }) => {
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`d-flex active_link nav-link text-light ${isActive ? 'active' : ''}`}
                        >
                            {reactIcon ? (
                                <span className="px-2 pt-1">{reactIcon}</span>
                            ) : (
                                <i className={`${icon} px-2 pt-1`}></i>
                            )}
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
