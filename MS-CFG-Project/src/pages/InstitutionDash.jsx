import useDeleteSelected from "./useDeleteSelected";

const InstitutionDash = ()=> {
     useDeleteSelected();
    
    return(
        <div>
            <div className = "institution-dash">
                <h1> Last updated: 09/25/25</h1>
                {/*University of Maryland*/}
                <h2>University of Maryland, College Park</h2>
                 <table>
                  <thead>
                    <tr> 
                        <th>Exams:</th>
                        <th> Minimum Score:</th>
                        <th>Credits Amount:</th>
                        <th>Last modified date:</th>
                        <th>Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                        <td>American Government</td>
                        <td>52</td>
                        <td>3.0</td>
                        <td>12/06/2024</td>
                        <td><input type = "checkbox" className = "row-select" aria-label = "Select row"/></td>
                    </tr>
                    <tr>
                        <td>Biology</td>
                        <td>49</td>
                        <td>3.0</td>
                        <td>12/06/2024</td>
                        <td><input type = "checkbox" className = "row-select" aria-label = "Select row"/></td>
                    </tr>
                    <tr>
                        <td>Calculus</td>
                        <td>50</td>
                        <td>3.0</td>
                        <td>12/06/2024</td>
                        <td><input type = "checkbox" className = "row-select" aria-label = "Select row"/></td>
                    </tr>
                    </tbody>
                </table>

                {/*Univfersity of Maryland*/}
                <h2>The Ohio State University</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Exams:</th>
                            <th>Minimum Score</th>
                            <th>Credits Amount</th>
                            <th>Last modified date</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td>American Government</td>
                          <td>52</td>
                          <td>3.0</td>
                          <td>12/06/2024</td>
                          <td><input type = "checkbox" className = "row-select" aria-label= "Select row"/></td>
                        </tr> 
                        <tr>
                          <td>Biology</td>
                          <td>50</td>
                          <td>3.0</td>
                          <td>12/06/2024</td>
                          <td><input type = "checkbox" className = "row-select" aria-label= "Select row"/></td>
                        </tr> 
                        <tr>
                           <td>Calculus</td> 
                           <td>64</td>
                           <td>5.0</td>
                           <td>12/06/2024</td>
                           <td><input type = "checkbox" className = "row-select" aria-label= "Select row"/></td>
                        </tr>
                    </tbody>
                </table>

                <button id = "delete-btn" disabled>
                    Delete Selected
                </button>
            </div>
        </div>
    );
}

export default InstitutionDash;
