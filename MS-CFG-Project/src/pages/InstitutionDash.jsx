export const InstitutionDash = ()=> {
    return(
        <div>
            <div className = "institution-dash">
                <h1> Last updated: 09/25/25</h1>
                <table>
                    <tr> 
                        <th>Exams:</th>
                        <th> Minimum Score:</th>
                        <th>Credits Amount:</th>
                        <th>Last modified date:</th>
                        <th>Delete</th>
                        <th>Update Information</th>
                    </tr>
                    <tr>
                        <td>American Government</td>
                        <td>52</td>
                        <td>3.0</td>
                        <td>12/06/2024</td>
                        <td><input type = "checkbox" class = "row-select" aria-label = "Select row"></input></td>
                    </tr>
                </table>
                </div>
                <button id = "delete-btn" disabled>Delete Selected</button>
            </div>
    );
};
export default InstitutionDash
