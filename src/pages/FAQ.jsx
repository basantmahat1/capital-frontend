import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Breadcrumbs } from '@mui/material'
import { Link } from 'react-router-dom'
import { ExpandMore, HelpOutline } from '@mui/icons-material'

const FAQ = () => {
  const faqs = [
    {
      question: "What services does Capital IT Solution provide?",
      answer: "We offer a wide range of IT services including computer and laptop repair, CCTV installation, network setup, web and software development, and printer repair."
    },
    {
      question: "How can I book a service?",
      answer: "You can book a service by navigating to the 'Services' page, selecting the desired service, and clicking on the 'Book Now' button. You can also contact us directly through our contact page."
    },
    {
      question: "Do you provide on-site repair services?",
      answer: "Yes, we provide on-site repair and maintenance services for businesses and individuals, depending on the nature of the problem."
    },
    {
      question: "How long does a typical computer repair take?",
      answer: "The duration depends on the complexity of the issue. Simple repairs like software installation or basic hardware replacement might take a few hours, while complex board-level repairs could take 2-3 business days."
    },
    {
      question: "Do you sell computer hardware and accessories?",
      answer: "Yes, we have a wide range of computer hardware, components, and accessories available in our products catalog."
    },
    {
      question: "What is your return policy for products?",
      answer: "We offer a 7-day return policy for products that are in their original condition and packaging. Please refer to our terms and conditions for more details."
    }
  ]

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '80vh', py: 6 }}>
      <Container maxWidth="md">
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#64748b' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Home</Typography>
          </Link>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>FAQ</Typography>
        </Breadcrumbs>

        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <HelpOutline sx={{ fontSize: 48, color: '#F1585E', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
            Find answers to common questions about our services and products.
          </Typography>
        </Box>

        <Box>
          {faqs.map((faq, index) => (
            <Accordion 
              key={index} 
              sx={{ 
                mb: 2, 
                borderRadius: '16px !important', 
                '&:before': { display: 'none' },
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMore sx={{ color: '#F1585E' }} />}
                sx={{ px: 3, py: 1 }}
              >
                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                <Typography sx={{ color: '#475569', lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default FAQ
