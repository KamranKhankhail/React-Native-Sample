import React from 'react'
import { Text, TouchableOpacity, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import { AppStyles } from '../../themes'
import { CustomButton } from '../index'
import { getReqDetails } from '../../utils/sharedUtils'
import { FRIEND_STATUSES } from '../../constants/constants'
import PlaceholderItem from '../PlaceholderItem'
import FastImage from 'react-native-fast-image'
import { withNavigation } from 'react-navigation'

function ViewContactItem (props) {
  const {
    item = {}, onPress, loading, loggedInUser = {}, friendId, onDeleteRequest, fetching, onUnblockContact, onUnmuteAccount
  } = props
  const { picture, name, fullName, id: contactId, friend, follow } = item
  const { id: loggedInUserId = '' } = loggedInUser || {}
  const { id: requestFriendId = '', status } = friend || {}

  const contactIcon = { uri: picture }

  const isNotSelf = loggedInUserId !== contactId

  const onPressContact = () => {
    let screen = isNotSelf ? 'OtherUserProfile' : 'ProfileScreen'
    props.navigation.push(screen, item)
  }

  const onPressRequest = () => {
    if (!status || status === FRIEND_STATUSES.DELETED) {
      onPress(contactId)
    } else if (status === FRIEND_STATUSES.PENDING || status === FRIEND_STATUSES.FRIEND) {
      onDeleteRequest(requestFriendId, contactId)
    } else if (status && status === FRIEND_STATUSES.UNBLOCK) {
      onUnblockContact(contactId)
    } else if (status && status === FRIEND_STATUSES.UNMUTE) {
      onUnmuteAccount(contactId)
    }
  }

  if (fetching) {
    return <PlaceholderItem/>
  }

  const { title, isHollow } = getReqDetails(status, follow)

  return (
    <TouchableOpacity
      onPress={onPressContact}
      style={styles.itemContainer}
    >
      <FastImage
        source={contactIcon}
        style={styles.imageContainer}
        defaultSource={AppStyles.iconSet.profileFilled}
      />
      <Text style={[styles.nameStyle, props.nameStyle]}>{name || fullName}</Text>
      {isNotSelf && (
        <CustomButton
          size="small"
          hollow={isHollow}
          onPress={onPressRequest}
          container={styles.followButton}
          loadingIndicatorColor={AppStyles.colorSet.pink}
          isLoading={(loading && String(friendId) === String(contactId))}
          title={title}
          backgroundColor={AppStyles.colorSet.purple}
        />
      )}
    </TouchableOpacity>
  )
}

export default withNavigation(ViewContactItem)

ViewContactItem.propTypes = {
  item: PropTypes.object,
  loggedInUser: PropTypes.object,
  isRadioVisible: PropTypes.bool,
  isRadio: PropTypes.bool,
  nameStyle: ViewPropTypes.style,
  onPressContact: PropTypes.func,
}

ViewContactItem.defaultProps = {
  item: {},
  loggedInUser: {},
  isRadioVisible: false,
  isRadio: false,
  nameStyle: {},
  onPressContact: () => {}
}
