import { Container, Typography, Box } from '@mui/material';

interface NotFoundProps {
  heading?: string;
  subHeading?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ heading, subHeading }) => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h5" color="primary" gutterBottom>
          {heading || "Record Not Found"}
        </Typography>
        <Typography variant="subtitle1" paragraph>
          {subHeading || "We couldn't find the record you are looking for"}
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound;
