import Nav from "comps/Nav"
import { GetServerSideProps } from "next"
import doc from "doc.json"
import View from "comps/View"
import Doc from "comps/Doc"
import React from "react"
import useMediaQuery from "hooks/useMediaQuery"
import { NARROW } from "pages"
import Drawer from "comps/Drawer"
import Head from "comps/Head"

export interface ReferenceProps {
    docEntries: string[]
}

const Reference: React.FC<ReferenceProps> = ({
    docEntries,
}) => {
    const [showType, setShowType] = React.useState<string | null>(null)
    const isNarrow = useMediaQuery(`(max-width: ${NARROW}px)`)
    const kaboomFuncTypes: { [key: string]: any } = doc.types.KaboomCtx[0].members;

    const docDefaultEntry = kaboomFuncTypes[docEntries[0]][0];

    return (
        <Nav>
            <Head
                title={`Kaboom.js - ${docEntries[0]}`}
                desc={docDefaultEntry?.jsDoc?.doc ?? "No description"}
            />
            {docEntries.map((name) => (
                <View stretchX gap={3} pad={0} key={name}>
                    <Doc
                        id={name}
                        key={name}
                        name={name}
                        anchor={name}
                        typeref={setShowType}
                    />
                </View>
            ))}
            <Drawer
                dir="right"
                pad={2}
                height="64%"
                paneWidth={isNarrow ? 320 : 360}
                expanded={showType !== null}
                setExpanded={(b) => {
                    if (b === false) {
                        setShowType(null)
                    }
                }}
            >
                {showType &&
                    <Doc
                        anchor={showType}
                        onAnchor={() => setShowType(null)}
                        name={showType}
                        typeref={setShowType}
                    />
                }
            </Drawer>
        </Nav>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { name: refName } = ctx.query

    if(!(typeof refName == "string")) return { notFound: true }

    const kaboomFuncTypes: { [key: string]: any } = doc.types.KaboomCtx[0].members;

	const docEntries = Object.keys(kaboomFuncTypes).filter(
		(name) => name.toLowerCase() === refName.toLowerCase(),
	)

	if(docEntries.length === 0) return { notFound: true }

    return {
        props: {
            docEntries
        },
    }
}

export default Reference