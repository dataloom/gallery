import React, { PropTypes } from 'react';

const data = [
  {
    id: 'd92dae60-626f-468c-b414-eef3e4faebc9',
    iri: 'http://dbpedia.org/resource/Buffalo,_Minnesota',
    label: 'Buffalo, Minnesota',
    latlng: '45.17194444444444,-93.87472222222222'
  },
  {
    id: '1998f22b-51f0-4002-854f-f32790e60297',
    iri: 'http://dbpedia.org/resource/Buffalo_Municipal_Airport_(Minnesota)',
    label: 'Buffalo Municipal Airport (Minnesota)',
    latlng: '45.159166666666664,-93.84333333333333'
  },
  {
    id: '30abd9e0-8766-4cdd-8c9e-9834c8c4bbb9',
    iri: 'http://dbpedia.org/resource/Dickinson,_Minnesota',
    label: 'Dickinson, Minnesota',
    latlng: '45.117777777777775,-93.81194444444445'
  },
  {
    id: '43730baf-f3e8-4883-b597-588293133909',
    iri: 'http://dbpedia.org/resource/Buffalo_High_School_(Buffalo,_Minnesota)',
    label: 'Buffalo High School (Buffalo, Minnesota)',
    latlng: '45.1824869,-93.829996'
  }
]

export class Visualization extends React.Component {

  static propTypes = {
    entitySetName: PropTypes.string
  }

  render() {
    return (
      <div>visualization</div>
    );
  }
}

export default Visualization;
