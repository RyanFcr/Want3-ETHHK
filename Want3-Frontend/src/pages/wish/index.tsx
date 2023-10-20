import React, { useRef, useState } from 'react'
import {
  Button as AntButton,
  Divider,
  Modal,
  message,
  Input as AntInput
} from 'antd'
import styled from 'styled-components'
import { Editor } from '@tinymce/tinymce-react'
import { UserOutlined } from '@ant-design/icons'
import tinyMce from 'tinymce/tinymce'
import {
  ThirdwebNftMedia,
  useContract,
  useContractRead,
  useAddress,
  useNFT,
  useContractWrite,
  Web3Button
} from '@thirdweb-dev/react'
import Discord from 'assets/discord.png'
import Telegram from 'assets/telegram.png'
import Twitter from 'assets/twitter.png'
import Vector from 'assets/Vector.png'
import Rectangle from 'assets/Rectangle.png'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { contractAddress } from 'config/constants'
import NFT from '../surprise/nft'
import ellipseImage from '../../assets/Ellipse4.png'
import modalImage from '../../assets/Modal.png'
import copylink from '../../assets/Group 7.png'

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-top: 20px;
  margin-left: 95px;
  margin-right: 95px;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-left: 20px;
    margin-right: 20px;
  }
`

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 50px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`

const Right = styled.div`
  flex: 1;
  padding-left: 20px;
  overflow-y: scroll;

  @media (max-width: 768px) {
    padding-left: 0;
  }
`

const PreviewLabel = styled.label`
  color: #000d4f;
  font-family: Inter;
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 28px;
`

const InvitationPreview = styled.div`
  flex: 1;
  border: 1px solid #000000;
  border-radius: 12px;
  margin-bottom: 20px;
  margin-right: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  backdrop-filter: blur(2px);
`

const InvitationContainer = styled.div`
  display: flex;
  background-image: linear-gradient(
    to right top,
    #f5f5b8,
    #f4f6c1,
    #f3f7c9,
    #f3f7d2,
    #f3f8da,
    #f0f8d5,
    #ecf9d0,
    #e7f9cc,
    #d9fabb,
    #c7fcac,
    #b0fd9f,
    #94ff94
  );
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`
const Title = styled.h1`
  color: #000d4f;
  font-family: Inter;
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 20px;
  margin-bottom: 20px;
`
const WantedNFT = styled.div`
  color: #000d4f;
  font-family: Inter;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 20px;
  margin-bottom: 20px;
`
const InvitationContent = styled.div`
  color: #000d4f;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 20px;
  margin-bottom: 20px;
`

const URL = styled.a`
  color: #000d4f;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  word-wrap: break-word;
  max-width: 300px;
`

const QRCodeContainer = styled.div``

// const Image = styled.img`
//     flex: 1;
//     width: auto;
//     height: auto;
//     max-width: 100%;
//     max-height: 50%;
//     border-radius: 10px;
//     margin-bottom: 20px;
// `;

const H1Label = styled.div`
  color: #000d4f;
  font-family: Inter;
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

const H2Label = styled.div`
  color: #000d4f;
  font-family: Inter;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 20px;
`

const IndentationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  padding-left: 15px;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
  }
`

const IndentationContainer_Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  padding-left: 15px;
  gap: 10px;
`
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`
const ImageContainerLeft = styled.div`
  display: flex;
  margin-top: 20px;
`

const Container_Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
`
const Input = styled.input`
  font-size: 30px;
  height: 100%;
  border: 1px solid #ccc;
  background: rgba(181, 209, 204, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(2px);
  width: 63%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const MyButton = styled(AntButton)`
  display: flex;
  height: 100%;
  width: 33%;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #000d4f;
  background: #f2ff26;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25);

  color: #b5d1cc;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const MyButton_Black = styled(AntButton)`
  display: flex;
  height: 100%;
  width: 33%;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #000d4f;
  background: #f2ff26;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25);
  margin-left: auto;
  margin-right: 20px;

  color: #000d4f;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

const HintLabel = styled.div`
  padding-left: 15px;
  color: #b5d1cc;
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  margin-top: 20px;
`

const DividerEx = styled(Divider)`
  background: #b5d1cc;
`
const LinkButtonX = styled(Link)`
  color: #fff;
  font-family: Montserrat;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  display: flex;
  padding: 15px 50px;
  justify-content: center;
  align-items: center;
  gap: 15px;

  border-radius: 10px;
  background: #000;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25);
`

const LinkButtonDiscord = styled(Link)`
  color: #fff;
  font-family: Montserrat;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  display: flex;
  padding: 15px 50px;
  justify-content: center;
  align-items: center;
  gap: 15px;

  border-radius: 10px;
  background: #5865f2;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25);
`

const LinkButtonTelegram = styled(Link)`
  color: #fff;
  font-family: Montserrat;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  display: flex;
  padding: 15px 50px;
  justify-content: center;
  align-items: center;
  gap: 15px;

  border-radius: 10px;
  background: #31a8db;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25);
`

const WishButton = styled(Web3Button)`
  display: flex !important;
  height: 100% !important;
  width: 33% !important;
  justify-content: center !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  border-radius: 8px !important;
  border: 1px solid #000d4f !important;
  background: #f2ff26 !important;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25) !important;

  color: #b5d1cc !important;
  font-family: Inter !important;
  font-size: 24px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;

  margin-bottom: 20px !important;
`
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`
const ModalButton = styled(AntButton)`
  display: flex;
  height: 100%;
  width: 75%;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #000d4f;
  background: #f2ff26;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25);

  gap: 15px;

  color: #000;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

const WishSuccessLabel = styled.div`
  color: #000d4f;
  font-family: Inter;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const Page: React.FC = () => {
  const userAddress = useAddress()
  const sharedLink = 'localhost:5173/surprise/'.concat(
    userAddress === undefined ? '' : userAddress
  )
  const apiUrl = 'https://api-want3.zeabur.app/v1'
  const [avatar, setAvatar] = useState('')
  const fileInputRef = useRef(null)
  const [inputUserName, setUserName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPageID, setModalPageID] = useState(1)
  const [inputAddress, setinputAddress] = useState('')
  const [nftAddress, setNftAddress] = useState('')
  const [inputTitle, setinputTitle] = useState('Title')
  const [inputContent, setinputContent] = useState('Hello world!')

  const [loading, setLoading] = useState<boolean>(false)

  const { contract } = useContract(contractAddress)

  const showModal = (pageId: number) => {
    setModalPageID(pageId)
    setIsModalOpen(true)
  }
  const handleInputChange = (e: any) => {
    setUserName(e.target.value)
  }

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(sharedLink)
      .then(() => {
        console.log('Image URL copied to clipboard')
      })
      .catch((error) => {
        console.error('Error copying image URL to clipboard', error)
      })
  }

  const handleDownloadImage = () => {
    const node = document.getElementById('invitation-preview')
    if (!node) return
    html2canvas(node, { useCORS: true }).then((canvas) => {
      const imgURL = canvas.toDataURL()
      const link = document.createElement('a')
      link.href = imgURL
      link.download = 'invitation.png'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  function Invitation() {
    return (
      <InvitationContainer>
        <ImageContainerLeft>
          <div
            style={{
              width: '90px',
              height: '95px',
              borderRadius: '100px',
              border: '2px solid rgba(190, 254, 244, 0.60)',
              backgroundImage: `url(${
                avatar || ellipseImage
              }), linear-gradient(210deg, rgba(88, 220, 200, 0.47) 4.86%, rgba(3, 60, 206, 0.45) 91.15%)`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50%',
              backgroundColor: 'lightgray',
              boxShadow: '3px 3px 13px -3px rgba(0, 0, 0, 0.25)'
            }}
          ></div>
        </ImageContainerLeft>
        <Title id="inv_title">{inputTitle}</Title>
        <NFT targetAddress={nftAddress} />
        <InvitationContent
          id="inv_content"
          dangerouslySetInnerHTML={{ __html: inputContent }}
        ></InvitationContent>
        <div>Link: </div>
        <URL href={sharedLink} id="inv_url">
          {sharedLink}
        </URL>
      </InvitationContainer>
    )
  }

  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    'addWant'
  )

  const fetchImage = () => {
    setNftAddress(inputAddress)
  }

  const handleUpload = async (e: any) => {
    const file = e.target.files[0]
    if (!file) {
      message.error('Please select a file first')
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const avatarData = (reader.result as string).split(',')[1] // Get Base64 string, remove prefix
      const wantAddr = userAddress // Example address, replace with real value
      setAvatar(`data:image/jpeg;base64,${avatarData}`)
      const dataToBeSent = {
        wantAddr: wantAddr,
        avatarData: avatarData,
        username: inputUserName
      }

      try {
        const response = await fetch(`${apiUrl}/wants/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToBeSent)
        })

        if (response.ok) {
          message.success('Uploaded successfully')
        } else {
          message.error('Upload failed')
        }
      } catch (error) {
        console.error('Error during the upload', error)
        message.error('Upload failed')
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <Content>
      <Modal open={isModalOpen} footer={null} onCancel={handleCancel}>
        <ModalContainer>
          <img src={modalImage} className="w-32 h-26 mt-0"></img>
          {modalPageID === 1 ? (
            <>
              <WishSuccessLabel>Your wish has been posted!</WishSuccessLabel>
              <ModalButton key="copy" type="primary" onClick={handleCopyLink}>
                <img src={copylink} style={{ width: '28px', height: '14px' }} />
                Copy Link
              </ModalButton>

              <ModalButton
                key="download"
                type="primary"
                onClick={handleDownloadImage}
              >
                Download Image
              </ModalButton>
            </>
          ) : (
            <WishSuccessLabel>Failed to post your wish!</WishSuccessLabel>
          )}
        </ModalContainer>
      </Modal>

      <Left>
        <PreviewLabel>Preview</PreviewLabel>
        <InvitationPreview id="invitation-preview">
          <Invitation />
        </InvitationPreview>
      </Left>
      <Right>
        <H1Label>Put your wish link here:</H1Label>
        <IndentationContainer>
          <Input
            type="text"
            value={inputAddress}
            onChange={(e) => setinputAddress(e.target.value)}
          />

          <MyButton loading={loading} onClick={fetchImage}>
            Upload
          </MyButton>
        </IndentationContainer>
        <HintLabel>
          Your wish will be appear in the preview once you submit it.
        </HintLabel>

        <DividerEx />
        <Container_Center>
          <ImageContainer>
            <div
              style={{
                width: '90px',
                height: '95px',
                borderRadius: '100px',
                border: '2px solid rgba(190, 254, 244, 0.60)',
                backgroundImage: `url(${
                  avatar || ellipseImage
                }), linear-gradient(210deg, rgba(88, 220, 200, 0.47) 4.86%, rgba(3, 60, 206, 0.45) 91.15%)`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50%',
                backgroundColor: 'lightgray',
                boxShadow: '3px 3px 13px -3px rgba(0, 0, 0, 0.25)'
              }}
            ></div>
          </ImageContainer>
        </Container_Center>
        <IndentationContainer_Center>
          <AntInput
            size="large"
            placeholder="User Name"
            onChange={handleInputChange}
            prefix={<UserOutlined />}
          />
          <input
            type="file"
            onChange={handleUpload}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <MyButton_Black
            type="primary"
            //@ts-ignore
            onClick={() => fileInputRef?.current?.click()}
          >
            Upload Profile
          </MyButton_Black>
        </IndentationContainer_Center>
        <DividerEx />
        <H1Label>Invitation Letter Contents</H1Label>
        <H2Label>Title</H2Label>
        <IndentationContainer>
          <Input
            type="text"
            value={inputTitle}
            onChange={(e) => setinputTitle(e.target.value)}
            style={{ width: '98%' }}
          />
        </IndentationContainer>
        <H2Label>Invitation Contents</H2Label>
        <IndentationContainer>
          <Editor
            apiKey="8unr8c1gn7mq5ilod91w36omll3lynnca8sgpeip87f3w4rh"
            id="main_editor"
            initialValue="<p>Hello world!</p>"
            onEditorChange={(content, editor) => {
              setinputContent(content)
            }}
            init={{
              width: '98%',
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
            }}
          />
        </IndentationContainer>
        <DividerEx />
        {/* <H1Label>Social Media</H1Label>
        <IndentationContainer_Center>
          <LinkButtonX to="https://twitter.com/" target="_blank">
            <img src={Twitter} style={{ width: '20px', height: '20px' }} />
            Twitter
          </LinkButtonX>
          <LinkButtonDiscord to="https://discord.com/" target="_blank">
            <img src={Discord} style={{ width: '20px', height: '20px' }} />
            Discord
          </LinkButtonDiscord>
          <LinkButtonTelegram to="https://telegram.org/" target="_blank">
            <img src={Telegram} style={{ width: '20px', height: '20px' }} />
            Telegram
          </LinkButtonTelegram>
        </IndentationContainer_Center>
        <DividerEx /> */}
        <H1Label>Receive Address</H1Label>
        <IndentationContainer>
          <Input
            type="text"
            disabled={true}
            value={userAddress}
            onChange={(e) => setinputTitle(e.target.value)}
            style={{ width: '98%' }}
          />
        </IndentationContainer>
        <DividerEx />
        <IndentationContainer_Center>
          <WishButton
            contractAddress={contractAddress}
            action={() => mutateAsync({ args: [inputAddress] })}
            // action={() => console.log('test...')}
            onSuccess={(result) => {
              console.log(result)
              var myHeaders = new Headers()
              myHeaders.append('Content-Type', 'application/json')
              const postData = JSON.stringify({
                wantAddr: userAddress,
                nftAddr: nftAddress,
                slogan: inputContent,
                title: inputTitle
              })
              console.log(postData)
              const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: postData
              }
              fetch(
                'https://api-want3.zeabur.app/v1/wants/want',
                requestOptions
              )
                .then((response) => {
                  if (response.ok) {
                    return response.json()
                  }
                  throw new Error('后端数据写入失败')
                })
                .then((data) => {
                  console.log('后端数据写入成功:', data)
                  showModal(1)
                })
                .catch((error) => {
                  console.error('后端数据写入失败:', error)
                  showModal(2)
                })
            }}
            onError={(result) => alert(result)}
          >
            Make a Wish
          </WishButton>
        </IndentationContainer_Center>
      </Right>
    </Content>
  )
}

export default Page
