export const InstitutionDash = ()=> {
    return(
        <div>
            <div className = "institution-dash">
                <h1> Last updated: 09/25/25</h1>
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
                        <td><input type = "checkbox" class = "row-select" aria-label = "Select row"/></td>
                    </tr>
                    <tr>
                        <td>Biology</td>
                        <td>49</td>
                        <td>3.0</td>
                        <td>12/06/2024</td>
                        <td><input type = "checkbox" class = "row-select" aria-label = "Select row"/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
                <button id = "delete-btn" disabled>Delete Selected</button>
            </div>
    );
};
