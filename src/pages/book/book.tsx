import React, { useEffect, useState } from "react";
import "./book.styles.scss";
import { Space, Divider, Tooltip } from "antd";
import { ColumnType } from "antd/lib/table";
import CTable from "../../components/table/CTable";
import TotalBoxUser from "../../components/totalBox/TotalBoxUser";
import { QUERY_PARAM } from "../../constants/get-api.constant";
import { useSelectorRoot, useDispatchRoot } from "../../redux/store";
import Utils from "../../utils/base-utils";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Select, Upload , Button} from "antd";
import {
  IBook,
  ICategory,
  IEditBookReq,
  IGetBooksRequest,
  IReqGetLatestBooks,
} from "../../common/book.interface";
import {
  addBookRequest,
  deleteBookRequest,
  editBookRequest,
  getBookRequest,
  getCategoryRequest,
  getDetailBookRequests,
} from "../../redux/controller";
import { motion } from "framer-motion";
import Modal from "antd/lib/modal/Modal";
import CKEditorComponent from "../../components/CKEditorComponent";
import * as parse from 'html-react-parser'
import DOMPurify from 'dompurify';

const Book = () => {

  const Option = Select ;
  const { bookList, totalBookRecords, detailBook, listCategory } =
    useSelectorRoot((state) => state.management);
  const [editorData, setEditorData] = useState("");

  const handleEditorChange = (content: string) => {
    setEditorData(content);
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [base64String, setBase64String] = useState('');

 
  const [showEditBookModal, setShowEditBookModal] = useState<boolean>(false);
  const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
  const [textSearch, setTextSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [detailEditBook, setDetailEditBook] = useState<any>() 
  const [currentSearchValue, setCurrentSearchValue] =
    useState<IGetBooksRequest>({
      size: QUERY_PARAM.size,
      offset: 0,
    });

  const columns: ColumnType<IBook>[] = [
    {
      title: "Số thứ tự",
      render: (_, __, rowIndex) => (
        <div className="span-table" style={{ textAlign: "center" }}>
          {rowIndex + 1}
        </div>
      ),
      width: "120px",
    },
    {
      title: "Tên Sách",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tác Giả",
      dataIndex: "author",
      key: "author",
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: "center" }} >{record.author}</div>
        </div>
      ),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: "center" }} >{new Date(record.createdAt).toLocaleDateString("en-GB")}</div>
        </div>
      ),
    },
    {
      title: "Ảnh Bìa",
      dataIndex: "cover",
      key: "cover",
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img style={{ width: "90px" }} src={record.cover} />
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle" style={{ display : 'flex' , justifyContent : 'center'}}>
          <Tooltip placement="top" title={"Chỉnh Sửa"}>
            <EditOutlined onClick={(event) => handleEdit(record)} />
          </Tooltip>
          <Tooltip placement="top" title={"Xem Chi Tiết"}>
            <EyeOutlined onClick={(event) => handleDetail(record)} />
          </Tooltip>
          <Tooltip placement="top" title={"Xóa"}>
            <DeleteOutlined onClick={(event) => handleDelete(record)} />
          </Tooltip>
          
        </Space>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getBookRequest(currentSearchValue));
  }, []);

  const onChangeInput = (event: any) => {
    setTextSearch(event.target.value);
  };

  const dispatch = useDispatchRoot();

  const onSearch = () => {
    const body: IGetBooksRequest = {
      size: QUERY_PARAM.size,
      offset: 0,
      search: textSearch,
    };
    const finalBody = Utils.getRidOfUnusedProperties(body);
    setCurrentSearchValue(finalBody);
    dispatch(getBookRequest(finalBody));
  };

  const onChangePagination = (event: any) => {
    currentSearchValue.offset = (event - 1) * QUERY_PARAM.size;
    setCurrentSearchValue(currentSearchValue);
    dispatch(getBookRequest(currentSearchValue));
  };

  const handleDetail = (record: any) => {
    const bodyrequest = {
      id: record.id,
    };
    dispatch(getDetailBookRequests(bodyrequest));
    setOpenModal(true);
  };

  useEffect(() => {
    dispatch(getCategoryRequest())
  },[])


  const handleEdit = (record: any) => {
    setDetailEditBook(record)
    setIdEdit(record.id)
    setShowEditBookModal(true);
  };

  const handleAddBook = () => {
    setShowAddBookModal(!showAddBookModal);

  };

  const handleDelete = (record: any) => {
      const bodyRequest = {
        id : record.id,
      }
      dispatch(deleteBookRequest(bodyRequest))
  };


  const [userTitleReq, setTitleReq] = useState<string>("");
  const [userAuthorReq, setAuthorReq] = useState<string>("");
  const [userPublisherReq, setPublisherReq] = useState<string>("");
  const [userCategoryIdsReq, setCategoryIdsReq] = useState([]);

  const [userEditTitleReq, setEditTitleReq] = useState<string>("");
  const [userEditAuthorReq, setEditAuthorReq] = useState<string>("");
  const [userEditPublisherReq, setEditPublisherReq] = useState<string>("");
  const [userEditCategoryIdsReq, setEditCategoryIdsReq] = useState([]);
  const [userEditDescriptionReq, setEditDescriptionReq] = useState("");
  const [idEdit , setIdEdit] = useState("")

  const handleInputTitleReqChange = (event: { target: { value: any } }) => {
    setTitleReq(event.target.value);
  };
  const handleInputAuthorReqChange = (event: { target: { value: any } }) => {
    setAuthorReq(event.target.value);
  };
  const handleInputPublisherReqChange = (event: { target: { value: any } }) => {
    setPublisherReq(event.target.value);
  };
  const handleInputCategoryIdsChange = (event : any) => {
    setCategoryIdsReq(event);
  };

  const handleEditInputTitleReqChange = (event: { target: { value: any } }) => {
    setEditTitleReq(event.target.value);
  };
  const handleEditInputAuthorReqChange = (event: { target: { value: any } }) => {
    setEditAuthorReq(event.target.value);
  };
  const handleEditInputPublisherReqChange = (event: { target: { value: any } }) => {
    setEditPublisherReq(event.target.value);
  };
  const handleEditInputCategoryIdsChange = (event : any) => {
    setEditCategoryIdsReq(event);
  };
  const handleEditDescriptionChange = (content : string) => {
    setEditDescriptionReq(content);
  };

  

  const onAddBook = () => {
    
      const bodyRequest = {
        title : userTitleReq,
        description : editorData,
        author : userAuthorReq,
        publisher : userPublisherReq,
        categoryIds : userCategoryIdsReq,
        quantity : 0,
        price : 0,
        cover : base64String,
      }
      
      dispatch(addBookRequest(bodyRequest))
      setShowAddBookModal(false)
  }

  const onEditBook = () => {
    
    const bodyRequest : IEditBookReq = {
        id : idEdit
    }
    if(userEditTitleReq !== ""){
      bodyRequest.title = userEditTitleReq
    }
    if(userEditAuthorReq !== ""){
      bodyRequest.author = userEditAuthorReq
    }
    if(userEditPublisherReq !== ""){
      bodyRequest.publisher = userEditPublisherReq
    }
    if(userEditDescriptionReq !== ""){
      bodyRequest.description = userEditDescriptionReq
    }
    if(userEditCategoryIdsReq.length > 0){
      bodyRequest.categoryIds = userEditCategoryIdsReq
    }
    dispatch(editBookRequest(bodyRequest))
    setEditTitleReq("")
    setEditDescriptionReq("")
    setEditPublisherReq("")
    setEditAuthorReq("")
    setEditCategoryIdsReq([])
    setShowEditBookModal(false)
  }
  
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Convert the selected file to base64
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setBase64String(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
  }, [base64String])

  const onCancelEditBook = () => {
    setEditTitleReq("")
    setEditDescriptionReq("")
    setEditPublisherReq("")
    setEditAuthorReq("")
    setEditCategoryIdsReq([])
    setShowEditBookModal(false)
  }

  return (
    <motion.div
      className="sketch-main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {detailBook && openModal && (
        <Modal
          open={openModal}
          onOk={() => setOpenModal(false)}
          closable={true}
          onCancel={() => setOpenModal(false)}
          title={"Chi Tiết Sách"}
          className="modal-detail-book"
          footer={false}
          width={1000}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                className="image"
                style={{ width: "200px" }}
                src={detailBook.cover}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Tên Sách:</div>
              <div>{detailBook.title}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Ngày Tạo: </div>
              <div>
                {new Date(detailBook.createdAt).toLocaleDateString("en-GB")}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Tác Giả: </div>
              <div>{detailBook.author}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Nhà Xuất Bản: </div>
              <div>{detailBook.publisher}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Thể Loại: </div>
              <div>
                {detailBook.categories
                  .map((category: any) => category.name)
                  .join(", ")}
              </div>
            </div>
            <div>
              <div style={{ width: "auto" }}>Mô tả: </div>
              <div dangerouslySetInnerHTML={{ __html: detailBook.description }} /> 
            </div>
          </div>
        </Modal>
      )}
      { showEditBookModal && (
        <Modal
          open={showEditBookModal}
          onOk={() => setShowEditBookModal(false)}
          closable={true}
          onCancel={onCancelEditBook}
          title={"Chỉnh sửa sách"}
          className="modal-edit-book"
          footer={false}
          width={1000}
        >
          {
            detailEditBook && 
            <Form
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
              layout="horizontal"
              style={{ maxWidth: 1000 }}
              onFinish={onEditBook}
            >
              <Form.Item className="title" label="Tên Sách">
                <Input defaultValue={detailEditBook.title} onChange={handleEditInputTitleReqChange} />
              </Form.Item>
              <Form.Item className="author" label="Tác Giả">
                <Input defaultValue={detailEditBook.author} onChange={handleEditInputAuthorReqChange} />
              </Form.Item>
              <Form.Item className="publisher" label="NXB">
                <Input defaultValue={detailEditBook.publisher} onChange={handleEditInputPublisherReqChange} />
              </Form.Item>
              <Form.Item className="categories" label="Thể Loại">
                <Select
                  id="select-criteria"
                  mode="multiple"
                  className="select-criteria"
                  placeholder="Chọn thể loại"
                  defaultValue={detailEditBook.categories.map((category : any) => category.id)}
                  onChange={handleEditInputCategoryIdsChange}
                >
                  {listCategory.map((category) => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item className="description" label="Mô Tả">
                <CKEditorComponent
                  initialValue={detailEditBook.description}
                  onChange={handleEditDescriptionChange}
                />
              </Form.Item>
              <Form.Item className="button-submit">
                <div style={{display: 'flex', justifyContent: 'end', gap: 16}}>
                <Button onClick={onCancelEditBook} >
                  Hủy
                </Button>
                <motion.div>
                  {
                    userEditTitleReq !== "" || userEditDescriptionReq !== "" || userEditPublisherReq !== "" || userEditAuthorReq !== "" || userEditCategoryIdsReq.length > 0 ?(
                      <Button type="primary" htmlType="submit">
                      Cập Nhật
                    </Button>
                    ) : (
                      <Button type="primary" htmlType="submit" disabled>
                      Cập Nhật
                      </Button>
                    )
 
                  }
                </motion.div>
                </div>
              </Form.Item>
            </Form>

          }
        </Modal>
      )}
      {showAddBookModal && (
        <Modal
          open={showAddBookModal}
          onOk={() => setShowAddBookModal(false)}
          closable={true}
          onCancel={() => setShowAddBookModal(false)}
          title={"Thêm Sách"}
          className="modal-add-book"
          footer={false}
          width={800}
        >
          <>
            <Form
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
              layout="horizontal"
              style={{ maxWidth: 1000 }}
              onFinish={onAddBook}
            >
              <Form.Item className="title" label="Tên Sách">
                <Input onChange={handleInputTitleReqChange} />
              </Form.Item>
              <Form.Item className="author" label="Tác Giả">
                <Input onChange={handleInputAuthorReqChange} />
              </Form.Item>
              <Form.Item className="publisher" label="NXB">
                <Input onChange={handleInputPublisherReqChange} />
              </Form.Item>
              <Form.Item className="categories" label="Thể Loại">
                <Select
                  id="select-criteria"
                  mode="multiple"
                  className="select-criteria"
                  placeholder="Chọn thể loại"
                  onChange={handleInputCategoryIdsChange}
                >
                  {listCategory.map((index) => (
                    <Option value={index.id}>{index.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                className="cover"
                label="Ảnh Bìa"
              >
                <input type="file" onChange={handleFileChange} accept=".png, .jpeg, .jpg" />
              </Form.Item>
              <Form.Item className="description" label="Mô Tả">
                <CKEditorComponent
                  initialValue=""
                  onChange={handleEditorChange}
                />
              </Form.Item>
              <Form.Item className="button-submit">
                <div style={{display: 'flex', justifyContent: 'end', gap: 16}}>
                <Button onClick={(event) => setShowAddBookModal(false)} >
                  Hủy
                </Button>
                <motion.div>
                  {
                    userTitleReq && base64String && editorData && userPublisherReq && userAuthorReq && userCategoryIdsReq?(
                      <Button type="primary" htmlType="submit">
                      Thêm
                    </Button>
                    ) : (
                      <Button type="primary" htmlType="submit" disabled>
                      Thêm
                      </Button>
                    )
 
                  }
                </motion.div>
                </div>
              </Form.Item>
            </Form>
          </>
        </Modal>
      )}
      <div className="table-area">
        <CTable
          tableMainTitle="Thông Tin Sách Của Bạn"
          allowTextSearch={true}
          onChangeInput={onChangeInput}
          onSearch={onSearch}
          titleOfColumnList={columns}
          data={bookList}
          totalRecord={totalBookRecords}
          onChangePagination={onChangePagination}
          allowAddObject={true}
          titleAddButton="Thêm sách"
          handleAddObject={handleAddBook}
        />
      </div>
    </motion.div>
  );
};

export default Book;
