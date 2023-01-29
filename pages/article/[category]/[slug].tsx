// import { useRouter } from 'next/router'
import React from 'react'
import db from '@utils/db'
import Sidebar from '@components/common/sidebar'
import marked from '@utils/marked'

interface ContentProps {
  title: string
  content: string
}

export async function getServerSideProps (context: { params: { slug: any } }) {
  const res = await db.query('select * from contents where slug = ?', [context.params.slug])
  const data = res?.[0]

  const content = marked.parse(data.text)
  return {
    props: {
      title: data.title,
      content
    } // will be passed to the page component as props
  }
}

const Content: React.FC<ContentProps> = ({
  title,
  content
}) => {
  // const router = useRouter()
  // const {
  //   category,
  //   id
  // } = router.query

  return (
    <div className="flex justify-center items-start min-h-full flex-1 py-6 px-32">
      <article className="prose text-left max-w-[70%] w-[70%] py-6 ">
        <h2 className="mb-10 dark:text-white">{title}</h2>
        <main className="dark:text-gray-200" dangerouslySetInnerHTML={{ __html: content }}></main>
      </article>
      <Sidebar/>
    </div>
  )
}

export default Content
