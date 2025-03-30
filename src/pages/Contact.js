import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { Container } from '../components/common/Container';
import { FaMapMarkerAlt, FaEnvelope, FaClock, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const ContactContainer = styled.div`
  padding: 2rem 0;
`;

const ContactHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
  text-align: center;
`;

const ContactTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ContactSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ContactCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.colors.secondary};
  padding-bottom: 0.5rem;
  display: inline-block;
`;

const CardContent = styled.div`
  line-height: 1.6;
  
  p {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  svg {
    margin-right: 10px;
    color: ${props => props.theme.colors.primary};
  }
`;

const ContactForm = styled.form`
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const MapContainer = styled.div`
  height: 400px;
  margin-bottom: 3rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.primary};
    color: white !important;
    transition: transform 0.3s ease, background-color 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      background-color: ${props => props.theme.colors.primaryDark};
      text-decoration: none !important;
    }
    
    svg {
      margin: 0;
      color: white;
    }
  }
`;

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // This would be where you'd handle the form submission
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | IPL Cricket Analytics</title>
        <meta name="description" content="Get in touch with the IPL Cricket Analytics team for support, feedback, or inquiries." />
      </Helmet>
      
      <ContactHeader>
        <Container>
          <ContactTitle>Contact Us</ContactTitle>
          <ContactSubtitle>
            Have questions or feedback? We'd love to hear from you. Reach out to our team using any of the methods below.
          </ContactSubtitle>
        </Container>
      </ContactHeader>
      
      <Container>
        <ContactContainer>
          <ContactGrid>
            <ContactCard>
              <CardTitle>Address</CardTitle>
              <CardContent>
                <p>
                  <FaMapMarkerAlt size={18} />
                  Crichattric Analytics<br />
                  Delhi, India
                </p>
              </CardContent>
            </ContactCard>
            
            <ContactCard>
              <CardTitle>Contact Information</CardTitle>
              <CardContent>
                <p><FaEnvelope size={18} /><strong>Email:</strong> <a href="mailto:contact.crichattric@gmail.com">contact.crichattric@gmail.com</a></p>
                <p><FaClock size={18} /><strong>Support Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST</p>
              </CardContent>
            </ContactCard>
            
            <ContactCard>
              <CardTitle>Social Media</CardTitle>
              <CardContent>
                <p>Follow us for the latest updates:</p>
                <SocialLinks>
                  <a href="https://twitter.com/crichattric" target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={20} />
                  </a>
                  <a href="https://facebook.com/crichattric" target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={20} />
                  </a>
                  <a href="https://instagram.com/crichattric" target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={20} />
                  </a>
                </SocialLinks>
              </CardContent>
            </ContactCard>
          </ContactGrid>
          
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Send Us a Message</h2>
          
          <ContactForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Your Name</Label>
              <Input type="text" id="name" required />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input type="email" id="email" required />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input type="text" id="subject" required />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <TextArea id="message" required></TextArea>
            </FormGroup>
            
            <SubmitButton type="submit">Send Message</SubmitButton>
          </ContactForm>
          
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Find Us</h2>
          
          <MapContainer>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.5400633435!2d77.04417455!3d28.6273928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi%2C%20India!5e0!3m2!1sen!2sus!4v1648042234567!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Crichattric Office Location"
            ></iframe>
          </MapContainer>
        </ContactContainer>
      </Container>
    </>
  );
};

export default Contact;
