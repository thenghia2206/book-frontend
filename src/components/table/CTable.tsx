import { Button, DatePicker, Select, Table } from 'antd';
import './ctable.styles.scss'

import React, { useEffect } from 'react'
import { ColumnsType } from 'antd/lib/table';
import Input from 'antd/lib/input/Input';
const { RangePicker } = DatePicker;

interface CTableProps {
    tableMainTitle?: string;
    allowTextSearch?: boolean;
    allowDateRangeSearch?: boolean;
    allowSelectBox?: boolean;
    allowAddObject?: boolean;
    selectBoxData?: any;
    selectBoxPlaceholder?: string;
    titleOfColumnList?: ColumnsType<any>;
    data?: any[];
    allowActionDetail?: boolean;
    allowActionBlock?: boolean;
    totalRecord: number;
    titleAddButton?: string;
    onChangeInput?: (event: any) => void;
    onChangeRangePicker?: (event: any) => void;
    onChangeSelectBox?: (event:any) => void;
    onSearch?: () => void;
    onChangePagination: (event: any) => void;
    handleAddObject?: () => void;
}

const CTable = (props: CTableProps) => {
    useEffect(() => {
        console.log(Math.ceil(props?.totalRecord))

        console.log(Math.ceil(props?.totalRecord / 10))
    }, [])
    return (
        <div className='table-main'>
            <div className='title-and-search'>
                <div className='title'>{props.tableMainTitle}</div>
                <div className='total'>Tổng số: {props.totalRecord}</div>
                <div className='search-area'>
                    {
                        props.allowTextSearch &&
                        <Input onChange={
                            (event) => {
                                if (props.onChangeInput) props.onChangeInput(event)
                            }
                        }
                        placeholder="Tên Sách, Tác Giả" />
                    }
                    {
                        (
                            props.allowTextSearch) &&
                        <Button
                            onClick={() => {
                                if (props.onSearch) props.onSearch()
                            }}
                        >Tìm kiếm</Button>
                    }
                    {
                        props.allowAddObject && 
                        <Button style={{backgroundColor : 'blue' , color : 'White'}} onClick={props.handleAddObject}>{props.titleAddButton}</Button>
                    }
                </div>
            </div>
            <div className='table'>
                <Table
                    scroll={{ y: 350 }}
                    columns={props.titleOfColumnList}
                    dataSource={props.data}
                    pagination={
                        {
                            total: props.totalRecord,
                            onChange: (event) => {
                                props.onChangePagination(event)

                            }
                        }
                    }
                />
            </div>
        </div>
    )
}

export default CTable