import PageContainer from '../components/PageContainer'
import Main from "../components/Main";
import Title from "../components/Title";
import Description from "../components/Description";

export default  function About() {
  return (
    <PageContainer>
      <Main>
        <Title>
          About us:
        </Title>
        <Description>
          some info about us..
        </Description>
        Contact us: 99344588
      </Main>
    </PageContainer>
  )
}