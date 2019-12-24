import React from "react";
import { Table } from 'reactstrap';

const Commontable = ( tableHeaders=[], tableData=[], tableDataList=[], loading ) => {
    return <div>
    <Table>
        <thead>
            {
                (tableHeaders && tableHeaders.length > 0) &&
                <tr>
                    {
                        tableHeaders.map(val => <th>{val}</th>)
                    }
                </tr>
            }
        </thead>
        <tbody>
            {
                ((tableData && tableData.length > 0) && !loading) &&
                tableData.map(data => {
                    return <tr>
                        {
                            tableDataList.map(val => <td>{data[val]}</td>)
                        }
                    </tr>
                })
            }
        </tbody>
    </Table>
        {
            !((tableData && tableData.length > 0) || loading) && 
            <div style={{ textAlign: "center" }}> No Data Found!</div>
        }
        {
            loading && <div style={{ textAlign: "center" }}>Loading...</div>
        }
</div>
}
    

export default Commontable;
