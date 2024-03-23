import fs from "fs/promises"
import { GetServerSideProps } from "next"
import Head from "comps/Head"
import Markdown from "comps/Markdown"
import Nav from "comps/Nav"
import { capitalize } from "lib/str"
import matter from "gray-matter"
import { useMemo } from "react"

const tutorialOrder = [
	"setup",
	"intro",
	"comp",
	"tips",
]

interface DocProps {
	name: string,
	src: string,
	tutorials: any[],
}

const Doc: React.FC<DocProps> = ({
	src,
	name,
	tutorials,
}) => {
	const doc = useMemo(() => matter(src), [src])

	return <Nav content="tutorial" contentItems={tutorials}>
		<Head title={`Kaboom - ${capitalize(name)}`} />
		<Markdown src={doc.content} baseUrl="/static/doc/" />
	</Nav>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const tutorials = []

	for await (const tutorialEntry of await fs.readdir("public/static/doc")) {
		if (!tutorialEntry.endsWith("md")) continue

		const blog = await fs.readFile(`public/static/doc/${tutorialEntry}`, "utf8")
		const data = matter(blog).data

		data.link = `doc/${tutorialEntry.substring(0, tutorialEntry.length - 3)}`

		tutorials.push(data)
	}

	tutorials.sort((a, b) => {
		const aName = a.link.substring(4)
		const bName = b.link.substring(4)

		const aIndex = tutorialOrder.indexOf(aName)
		const bIndex = tutorialOrder.indexOf(bName)

		if (aIndex === -1) return 1
		if (bIndex === -1) return -1

		return aIndex - bIndex
	})

	const { name } = ctx.query
	const path = `kaboom/doc/${name}.md`

	try {
		return {
			props: {
				name: name,
				src: await fs.readFile(path, "utf8"),
				tutorials,
			},
		}
	} catch (e) {
		return {
			notFound: true,
		}
	}
}

export default Doc
