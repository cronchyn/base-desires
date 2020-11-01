import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useParams,
  Link,
} from 'react-router-dom';
import { FaSearch} from 'react-icons/fa'

import { Warscrolls } from './warscrolls/data';
import { toStandard } from './utils';
import { TWarscrolls, TWarscroll } from './warscrolls/types';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/"><SearchResults /></Route>
        <Route strict path="/:slug/" children={<Warscroll />} />
        <Route path="/:slug" children={<SearchResults />} />
      </Switch>
    </Router>
  )
}

const SearchBox: React.FC = () => {
  const history = useHistory()
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    history.push(toStandard(`/${value}`))
  }

  return (
    <div className="form-row align-items-center">
      <div className="col"></div>
      <div className="col-8">
        <div className="input-group mb-3 mt-3">
          <div className="input-group-prepend">
            <div className="input-group-text"><FaSearch /></div>
          </div>
          <input className="form-control" value={searchTerm} onChange={handleChange} autoFocus />
        </div>
      </div>
      <div className="col"></div>
    </div>
  )
}

interface ICardProps {
  key: string
  name: string
  warscroll: TWarscroll
  link: boolean
}

const Card: React.FC<ICardProps> = props => {
  const { key, name, warscroll, link } = props
  return (
    <div className="card warscroll-card mb-3" key={key}>
      <div className="card-body">
        <h2>{ link ? <Link to={`/${toStandard(name)}/`}>{name}</Link> : <>{name}</>}</h2>
        <p className="card-text">{ warscroll.baseSize }</p>
        { warscroll.notes && <p className="card-notes">{ warscroll.notes }</p>}
      </div>
    </div>
  )
}

const SearchResults = () => {
  const { slug } = useParams()
  const standardisedSlug = slug ? toStandard(slug) : ""
  const warscrollNames = Object.keys(Warscrolls).filter(name => toStandard(name).includes(standardisedSlug))
  const warscrolls = warscrollNames.reduce((accum, warscrollName) => {
    accum[warscrollName] = Warscrolls[warscrollName]
    return accum
  }, {} as TWarscrolls)

  return (
    <Page warscrolls={warscrolls} showSearch={true} linkToWarscrolls={true} />
  )
}

const Warscroll = () => {
  const { slug } = useParams()
  const standardisedSlug = slug ? toStandard(slug) : ""
  const name = Object.keys(Warscrolls).find(name => toStandard(name) === standardisedSlug)
  const warscroll = name && Warscrolls[name]
  const warscrolls: TWarscrolls = {}
  if (name && warscroll) warscrolls[name] = warscroll

  return (name && warscroll) ? (
    <Page warscrolls={warscrolls} showSearch={false} linkToWarscrolls={false} />
  )
  :
  SearchResults()
}

interface IPageProps {
  warscrolls: TWarscrolls
  showSearch: boolean
  linkToWarscrolls: boolean
}

const Page: React.FC<IPageProps> = props => {
  const { warscrolls, showSearch, linkToWarscrolls } = props

  const cardColumnStyle = (Object.keys(warscrolls).length > 1) ? "col-md-6" : "col-12"

  return (
    <div className="container pt-3">
      <h1><Link to={"/"}>Base Desires</Link></h1>
      <div className="sticky-top bg-white">
        { showSearch && <SearchBox /> }
      </div>
      <div className="row">
        {Object.entries(warscrolls).map(([name, warscroll]) =>
          <div className={cardColumnStyle}>
            <Card name={name} warscroll={warscroll} key={name} link={linkToWarscrolls} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App;
