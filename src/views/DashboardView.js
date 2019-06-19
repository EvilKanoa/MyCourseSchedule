import React, { PureComponent } from 'react';

import CourseContainer from "components/CourseContainer"

class DashboardView extends PureComponent {
  render() {
    return (
      <div id="view-dashboard">
        <h1 style={{ textAlign: 'center', marginTop: '50px' }}>
          Nothing to see here yet...
        </h1>
        <p style={{ textAlign: 'center', marginTop: '50px' }}>
          {/*But do check out the sidebar!*/}
          <CourseContainer code={"CIS*1300"} institution={"UOG"} term={"F19"}/>
        </p>
      </div>
    );
  }
}

export default DashboardView;
