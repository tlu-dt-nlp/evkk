import { Box } from '@mui/material';
import SingleLinkedResourceList from './SingleLinkedResourceList';
import { grants } from '../../const/PublicationsAndGrantsConstants';

export default function Grants() {

  return (
    <Box>
      <SingleLinkedResourceList list={grants}/>
    </Box>
  );
}
