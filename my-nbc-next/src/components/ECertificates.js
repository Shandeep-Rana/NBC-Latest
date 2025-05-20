"use client";

import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import certificate from '../../public/images/Certificate.png';
import Image from 'next/image';
import moment from 'moment';
import { Table } from 'antd';
import Loader from '@/common/Loader';
import { getECertificates } from '@/Slice/events';
import Link from 'next/link';

const ECertificates = () => {
    const [email, setEmail] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [certsPerPage] = useState(5);
    const dispatch = useDispatch();
    const { userCertificates, isLoading } = useSelector((state) => state.event);

    const handleDownload = (index) => {
        const cert = userCertificates[index];
        const filename = `certificate_${index + 1}`;
        const pdf = new jsPDF();

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const originalWidth = 3616;
        const originalHeight = 2552;
        const aspectRatio = originalWidth / originalHeight;

        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth / aspectRatio;

        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * aspectRatio;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;

        // Convert imported image into base64 for jsPDF
        const img = new Image();
        img.src = certificate.src;
        img.onload = () => {
            pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
            pdf.setFontSize(9);
            pdf.text(cert.certificate_no || "CERT-N/A", pdfWidth - 54, 90.5);
            pdf.setFontSize(12);
            pdf.text("Rohit Garg", pdfWidth - 73, 200);
            pdf.setFontSize(20);
            pdf.text(cert.name, pdfWidth / 2, 165, { align: 'center' });
            pdf.setFontSize(12);
            pdf.text(cert.eventName, pdfWidth / 2, 179, { align: 'center' });
            pdf.text(moment(cert.endDateTime).format("DD/MM/YYYY"), pdfWidth - 161, 200);
            pdf.save(`${filename}.pdf`);
        };
    };

    const handleView = (index) => {
        const cert = userCertificates[index];
        const pdf = new jsPDF();

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const originalWidth = 3616;
        const originalHeight = 2552;
        const aspectRatio = originalWidth / originalHeight;

        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth / aspectRatio;

        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * aspectRatio;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;

        const img = new Image();
        img.src = certificate.src;
        img.onload = () => {
            pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
            pdf.setFontSize(9);
            pdf.text(cert.certificate_no || "CERT-N/A", pdfWidth - 54, 90.5);
            pdf.setFontSize(12);
            pdf.text("Rohit Garg", pdfWidth - 73, 200);
            pdf.setFontSize(20);
            pdf.text(cert.name, pdfWidth / 2, 165, { align: 'center' });
            pdf.setFontSize(12);
            pdf.text(cert.eventName, pdfWidth / 2, 179, { align: 'center' });
            pdf.text(moment(cert.endDateTime).format("DD/MM/YYYY"), pdfWidth - 161, 200);

            const blob = pdf.output('blob');
            const pdfURL = URL.createObjectURL(blob);
            window.open(pdfURL, '_blank');
        };
    };

    const fetchCertificates = async () => {
        try {
            dispatch(getECertificates({ email }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchCertificates();
    };

    const itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
            return <button className="btn btn-sm btn-primary">Previous</button>;
        }
        if (type === 'next') {
            return <button className="btn btn-sm btn-primary">Next</button>;
        }
        return originalElement;
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Event',
            dataIndex: 'eventName',
            sorter: (a, b) => a.eventName.length - b.eventName.length,
        },
        {
            title: 'Action',
            render: (text, record, index) => (
                <div className="d-flex justify-content-around">
                    <Button onClick={() => handleDownload(index)} className="button-round border_radius">
                        Download PDF
                    </Button>
                    <Button onClick={() => handleView(index)} className="button-round border_radius">
                        View PDF
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <main id="content" className="site-main">
            <div className="page-header parallaxie">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="page-header-box">
                                <h1 className="text-anime-style-2" data-cursor="-opaque">
                                    <span>Member</span> E-Certificates
                                </h1>
                                <nav className="wow fadeInUp">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            E-Certificates
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <Container className="my-5">
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>
                                        <b>
                                            Enter your email to view certificates{' '}
                                            <span style={{ color: 'red' }}>*</span>
                                        </b>
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <br />
                                <Button type="submit" className="button-round border_radius">
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    <br />
                    <Table
                        pagination={{
                            showTotal: (total, range) =>
                                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            showSizeChanger: true,
                            itemRender,
                        }}
                        bordered
                        style={{ overflowX: 'auto' }}
                        columns={columns}
                        dataSource={userCertificates}
                        rowKey={(record) => record.donorId}
                    />
                </Container>
            )}
        </main>
    );
};

export default ECertificates;

