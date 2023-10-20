import { useParams } from 'react-router-dom'
import React, { useState, useRef, useEffect } from 'react'
import { Web3Button } from '@thirdweb-dev/react'
import styled from 'styled-components'
import { Modal, Typography, Slider, Progress } from 'antd'
import './DonationModal.css'
import NFT from './nft'
import { WantDetails } from './surprise'
import ellipseImage from '../../assets/Ellipse4.png'
import { contractAddress } from 'config/constants'
import {
  useContractWrite,
  useContract,
  useContractRead,
  useNFT,
  ThirdwebNftMedia
} from '@thirdweb-dev/react'

const apiUrl = 'https://api-want3.zeabur.app/v1'

const ImageContainerLeft = styled.div`
  display: flex;
  margin-top: 20px;
`

const SilderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
`

const SilderLabel = styled.div`
  color: #000d4f;
  text-align: center;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`
const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`
const PayContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: #fff;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.15);
  width: 80%;
`
const HintLabel = styled.div`
  color: #000d4f;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
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
const WishButton = styled(Web3Button)`
  display: flex !important;
  height: 100% !important;
  width: 31% !important;
  justify-content: center !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  border-radius: 8px !important;
  border: 1px solid #000d4f !important;
  background: #f2ff26 !important;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25) !important;

  color: #000d4f !important;
  font-family: Inter !important;
  font-size: 18px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;

  margin-bottom: 20px !important;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    padding-left: 0;
  }
`

const Surprise = () => {
  const [avatar, setAvatar] = useState('')
  const [userName, setUserName] = useState('')
  const [donationAmount, setDonationAmount] = useState(0)
  const [donateSuccess, setDonateSuccess] = useState(0)
  const [buySuccess, setBuySuccess] = useState(0)
  const { wanterAddr } = useParams()

  const [wantDetails, setWantDetails] = useState<WantDetails[] | null>([])
  const [getWantError, setGetWantError] = useState(null)

  const { contract } = useContract(contractAddress)
  const { data, isLoading, error } = useContractRead(contract, 'wantList', [
    wanterAddr
  ])
  // const data = 0x29508801d260499b710CF33E35235bCFdffcE561;
  const {
    mutateAsync,
    isLoading: isLoading1,
    error: error1
  } = useContractWrite(contract, 'donateFund')

  console.log('contract:', contract)

  if (error) {
    console.error('failed to read contract', error)
  } else {
    console.log('contract data:', data, isLoading, error)
    console.log('wanterAddr:', wanterAddr)
  }
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/wants/profile?wantAddr=${wanterAddr}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText)
        }

        const data = await response.json()
        console.log('data.avatarData')
        if (data && data.avatarData) {
          setAvatar(`data:image/jpeg;base64,${data.avatarData}`)
        }
        if (data && data.username) {
          setUserName(data.username)
        }
      } catch (error) {
        console.error('Failed to fetch avatar', error)
      }
    }
    fetchAvatar()
  }, [])

  useEffect(() => {
    const fetchWantDetails = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/wants/want?wantAddr=${wanterAddr}`
        )

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }
        console.log('wants response: ', response)
        const responseData = await response.json()

        setWantDetails(responseData)
        console.log('want details: ', responseData)
      } catch (err) {
        console.error('fetch error: ', err)
      }
    }

    fetchWantDetails()
  }, [wanterAddr])

  const { Title } = Typography
  const [visible, setVisible] = useState(false)

  const showModal = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <>
      <Content>
        {getWantError && <div>Error: {getWantError}</div>}
        {!wantDetails || wantDetails.length === 0 ? (
          <div>This address does not have a wish!</div>
        ) : (
          <Left>
            <InvitationPreview id="invitation-preview">
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

                <Title>{wantDetails[0].title}</Title>
                <NFT targetAddress={wantDetails[0].nftAddr} />
                <InvitationContent
                  dangerouslySetInnerHTML={{
                    __html: wantDetails[0].slogan
                  }}
                ></InvitationContent>
                <div>Link: </div>
                <URL href={window.location.href}>{window.location.href}</URL>
              </InvitationContainer>
            </InvitationPreview>
          </Left>
        )}

        {/* Donation Section */}
        {/* <div className="flex-1 flex flex-col justify-center items-center p-5 space-y-2"> */}
        <Right>
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
          <div
            style={{
              color: '#000D4F',
              textAlign: 'center',
              fontFamily: 'Inter',
              fontSize: '24px',
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: 'normal'
            }}
          >
            {userName || 'User'}
          </div>
          <div>Make a Wish For</div>
          <div
            style={{
              color: '#31A8DB',
              fontFamily: 'Inter',
              fontSize: '24px',
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: 'normal'
            }}
          >
            Azuki #01
          </div>

          <ProgressContainer>
            <HintLabel style={{ marginTop: '10px', marginBottom: '5px' }}>
              Fundraising progress
            </HintLabel>
            <Progress
              type="circle"
              strokeColor="#00A86B"
              percent={((wantDetails?.[0]?.realizeValue ?? 0) / 10) * 100}
            />
            <HintLabel style={{ marginBottom: '5px' }}>
              {wantDetails?.[0]?.realizeValue ?? 0}E / 10E
            </HintLabel>
          </ProgressContainer>
          <PayContainer>
            <HintLabel style={{ marginTop: '15px' }}>Help to Pay</HintLabel>
            <SilderContainer>
              <SilderLabel>0%</SilderLabel>
              <Slider
                style={{ flex: 1, marginLeft: '10px', marginRight: '10px' }}
                min={0.01}
                max={10 - (wantDetails?.[0]?.realizeValue ?? 0)}
                step={0.01}
                defaultValue={0.1}
                onChange={setDonationAmount}
              ></Slider>
              <SilderLabel>100%</SilderLabel>
            </SilderContainer>
            <BottomContainer>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                className="w-1.1/4 p-2.5 border rounded-md"
              />
            </BottomContainer>
            <BottomContainer
              style={{ marginTop: '10px', marginBottom: '10px' }}
            >
              <WishButton
                contractAddress={contractAddress}
                action={async () => {
                  console.log(wanterAddr)
                  console.log(donationAmount)
                  setDonateSuccess(3)

                  try {
                    let result = await mutateAsync({
                      args: [wanterAddr, (donationAmount * 1e18).toString()],
                      overrides: {
                        gasLimit: 5000000
                        // value: utils.parseEther("0.1"), // send 0.1 native token with the contract call
                      }
                    })
                    console.log(result)
                    setDonateSuccess(1)

                    const dataToBeSent = {
                      wantId: wanterAddr,
                      donaterAddr: data,
                      value: donationAmount,
                      message: 'Transaction successful'
                    }

                    const response = await fetch(apiUrl + '/wants/donate', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(dataToBeSent)
                    })

                    console.log(response)
                    showModal()
                  } catch (e) {
                    console.log(e)
                    setDonateSuccess(2)
                  }
                }}
              >
                Pay
              </WishButton>
            </BottomContainer>
          </PayContainer>
          <div className="text-m font-bold mb-5">
            {donateSuccess === 1 && <p>Support Successful</p>}
            {donateSuccess === 2 && <p>Support Failed</p>}
            {donateSuccess === 3 && <p>Supporting...</p>}
          </div>
          <div>
            {/* <Button
              onClick={() => {
                // const { data:queryCouldBuy } = useContractRead(contract, "couldBuy",[wanterAddr]);
                console.log('queryCouldBuy : 是否达到了预定的金额 ')
                setBuySuccess(1)
                showModal()
              }}
            >
              点击弹窗
            </Button> */}
            <Modal
              visible={visible}
              onCancel={handleCancel}
              footer={null}
              className="custom-modal" // 添加自定义 CSS 类名
            >
              <div className="modal-content">
                {buySuccess == 0 ? (
                  <Title level={2} className="success-title">
                    恭喜你成为榜一大哥!!!
                  </Title>
                ) : (
                  <>
                    <Title level={4} className="count-title">
                      您是捐赠者中的第1名
                    </Title>
                    {/* 在这里根据实际情况显示第几名 */}
                  </>
                )}
                <Progress
                  type="circle"
                  strokeColor="#00A86B"
                  percent={
                    (((wantDetails?.[0]?.realizeValue ?? 0) + donationAmount) /
                      10) *
                    100
                  }
                />
              </div>
            </Modal>
          </div>
        </Right>
      </Content>
    </>
  )
}

export default Surprise
