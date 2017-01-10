import * as actionTypes from './CatalogActionTypes';
import { Permission } from '../../core/permissions/Permission';
import * as actionFactories from './CatalogActionFactories';
import { Observable } from 'rxjs';

const EXAMPLE_ENTITY_SET = {
  "key": "asdf",
  "name": "Employees",
  "title": "The entity set title",
  "type": {
    "name": "employee",
    "namespace": "testcsv"
  },
  "properties": [{
    "title": "Prop1",
    "description": "Blah blah blah",
    "permission": Permission.OWNER
  }],
  "permission": Permission.OWNER,
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tempor, ipsum sed fermentum sollicitudin, arcu orci posuere leo, sed lobortis dui arcu sed leo. Integer posuere libero mollis sem vestibulum laoreet sit amet eu risus. Aliquam sit amet sapien eget urna posuere ultricies ut sed orci. Fusce quis pretium tortor, a ultrices dolor. Nunc vel vestibulum mi. Suspendisse potenti. Vivamus posuere sagittis velit, id porta metus consectetur sed. Vivamus imperdiet semper arcu, vel feugiat mi cursus id. Mauris maximus erat eu ante malesuada, et hendrerit diam pulvinar. In hac habitasse platea dictumst. Sed odio turpis, molestie aliquam urna nec, ullamcorper consequat augue. Quisque mollis sem in erat varius tempus. Aliquam fermentum justo nisl, in egestas dolor sodales quis. Interdum et malesuada fames ac ante ipsum primis in faucibus." +
  "Etiam dictum gravida suscipit. Etiam convallis posuere purus ac dictum. Aenean feugiat ante vitae sem imperdiet, at volutpat dolor finibus. Pellentesque tincidunt purus sem, eget ultricies justo mattis vel. Quisque placerat lacus quis lectus euismod, ac tristique nisl aliquam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi ut nunc accumsan, sagittis nibh eget, commodo est. Pellentesque convallis, neque sed finibus congue, odio diam pretium sem, quis posuere lectus nibh eget ante. Aenean non quam eget lectus semper sagittis. Donec semper gravida ultrices." +
  "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam egestas, lacus vitae viverra semper, ligula ante cursus eros, id ultrices justo ipsum ac sem. Morbi vitae iaculis purus, sed pulvinar libero. Praesent at libero semper, lacinia nisi a, fringilla magna. Fusce non malesuada nisi. Praesent pulvinar tortor eget diam finibus, in tristique ante condimentum. Morbi neque orci, blandit eu tristique ut, pellentesque vel nisi. Aenean eget lectus mollis, fermentum enim at, luctus dolor. Morbi interdum pretium finibus." +
  "Morbi ipsum diam, pretium a tellus nec, scelerisque pretium felis. Sed in magna vel nibh viverra placerat sed ut velit. Fusce vulputate arcu vel auctor fringilla. Mauris commodo pulvinar tellus, sit amet finibus nulla tempor ut. Integer convallis luctus urna non finibus. Sed elementum magna ex, quis elementum dolor ornare non. Mauris elementum elit ac nunc iaculis pretium. Praesent sed orci ex." +
  "In finibus sem a cursus lobortis. Curabitur laoreet orci eget nisl pharetra ornare. Aliquam pulvinar eros nisi, vel porta nunc tincidunt eu. Ut id hendrerit lectus. Nunc cursus eleifend tincidunt. In vitae maximus leo. Nullam arcu arcu, faucibus vel fermentum ullamcorper, scelerisque quis ligula. Suspendisse nec sapien et mi convallis interdum vel non sapien. Fusce vitae semper arcu. Phasellus ut nisi pharetra, dapibus tellus eleifend, accumsan orci. Duis arcu enim, venenatis eu dictum id, laoreet non dolor. Morbi feugiat erat quis nulla tristique rutrum."
};

export default function(action$) {
  return action$.ofType(actionTypes.ENTITY_SET_LIST_REQUEST)
    .delay(2000)
    .mapTo(actionFactories.createEntitySetListSuccess([EXAMPLE_ENTITY_SET]))
    .catch(error => Observable.of(actionFactories.createEntitySetListFailure(error.xhr.response)));
}