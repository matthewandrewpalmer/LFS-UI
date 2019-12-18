import React from "react";
import {BATCH_HEADERS} from "../../utilities/Headers";
import {ONSAccordionTable} from "../../components/ONS_DesignSystem/ONSAccordionTable";
import {getUploadStatusStyle, monthNumberToString} from "../../utilities/Common_Functions";
import {ONSStatus} from "../../components/ONS_DesignSystem/ONSStatus";
import {Link} from "react-router-dom";

interface Props {
    batchData: [] | null
    openModal: Function
    batchType: string
    year: string
    period: string
    caption: boolean
}

export function MonthlyBatchUploadTable(props: Props) {

    let BatchUploadTableRow = (rowData: any) => {
        let row = rowData.row;
        return (
            <>
                <td className="table__cell ">
                    {row.type}
                </td>
                <td className="table__cell ">
                    {row.type === "NI" ?
                        monthNumberToString(+row.month)
                        :
                        "Week " + row.week
                    }
                </td>
                <td className="table__cell ">
                    <ONSStatus label={getUploadStatusStyle(+row.status).text} small={false}
                               status={getUploadStatusStyle(+row.status).colour}/>
                </td>
                <td className="table__cell ">
                    <Link
                        className={"breadcrumb__link"}
                        to={"/survey-import/" + row.type.toLowerCase() + "/" + row.week + "/" + row.month + "/" + row.year}>
                        Import
                    </Link>
                </td>
                {
                    row.status === 0 ?
                        <td className="table__cell "/>
                        :
                        <td className="table__cell ">
                            <a onClick={(() => props.openModal(row))}>Summary</a>
                        </td>
                }
            </>
        );
    };

    return (
        <ONSAccordionTable Headers={BATCH_HEADERS}
                           data={props.batchData}
                           Row={BatchUploadTableRow}
                           expandedRowEnabled={false}
                           noDataMessage={"No Data"}
                           caption={props.caption ? "Survey Files" : undefined}
        />
    );
}