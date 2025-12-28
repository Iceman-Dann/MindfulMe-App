import React from 'react';
import InteractiveCBT from './InteractiveCBT.js';

const CBT = () => {
    return <InteractiveCBT />;
};

export default CBT;






// import React, { useEffect } from 'react';
// import { Grid } from '@mui/material';

// const CBT = () => {
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://widget.rss.app/v1/wall.js';
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <div id="95hSzCOkXELqfmQn">
//           <rssapp-wall id="95hSzCOkXELqfmQn"></rssapp-wall>
//         </div>
//       </Grid>
//     </Grid>
//   );
// };
