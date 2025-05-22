import * as S from "@/components/footer/footer.style"


import FooterInput from "@/components/footer/footerInput/footerInput";
const Footer = () => {
	return (
		<S.FooterContainer>
			{/*<FiUser size={20} />*/}
			{/*<RiFileListLine />*/}
			{/*<FiPlusCircle />*/}
			{/*<PiPencilSimpleLineLight />*/}
			{/*<BiSend/>*/}
			<FooterInput/>
		</S.FooterContainer>
	)
}
export default Footer;