#pragma version ^0.3.10

owner: address
SLASH_POOL: constant(address) = 0x08B9EC0F678374660dB79C8Ae832Ace4Ff81d140
slash_pool: public(address)
MAX_REVIEWS: constant(uint8) = 42
max_reviews: public(uint8)
MAX_CONCURRENT_NOTES: constant(uint8) = 10
max_concurrent_notes: public(uint8)
POST_URL_MAX_LENGTH: constant(uint8) = 142
post_url_max_length: public(uint8)
truemint_guardians_balances: public(HashMap[address, uint256])

# Note gets a final score based on their reviews.
enum Rating:
    NOT_HELPFUL # 1
    SOMEWHAT_HELPFUL # 2
    HELPFUL # 4

struct Review:
    rating: Rating
    reviewer: address

struct Note:
    post_url: String[POST_URL_MAX_LENGTH]
    content: bytes32
    reviews: DynArray[Review, MAX_REVIEWS]
    current_rating: Rating
    is_final: bool

community_notes: public(HashMap[address, DynArray[Note, MAX_CONCURRENT_NOTES]])


@external
def __init__():
    self.owner = msg.sender
    # CUSTOM CONSTANTS
    self.slash_pool = SLASH_POOL
    self.max_reviews = MAX_REVIEWS
    self.max_concurrent_notes = MAX_CONCURRENT_NOTES
    self.post_url_max_length = POST_URL_MAX_LENGTH


@external
@payable
def deposit():
    assert msg.value > 0
    self.truemint_guardians_balances[msg.sender] = msg.value


@external
def submit_note(post_url: String[142], content: bytes32):
    note: Note = Note({
        post_url: post_url,
        content: content,
        reviews: [],
        current_rating: Rating.NOT_HELPFUL,
        is_final: False,
    })

    self.community_notes[msg.sender].append(note)


@internal
def get_note(creator: address, content: bytes32) -> Note:
    notes: DynArray[Note, MAX_CONCURRENT_NOTES] = self.community_notes[creator]
    for note in notes:
        if note.content == content:
            return note
    raise "Note not Found!"


@external
def submit_review(creator: address, content: bytes32, rating: Rating):
    note: Note = self.get_note(creator, content)
    review: Review = Review({
        rating: rating,
        reviewer: msg.sender,
    })
    note.reviews.append(review)


@internal
def launch_rewards(creator: address, note: Note):
    assert note.is_final == False, "Rewards are launched after note has received a final rating!"
    # TODO: implement coherent reward strategy
    if note.current_rating == Rating.HELPFUL:
        self.truemint_guardians_balances[creator] += 4
    elif note.current_rating == Rating.SOMEWHAT_HELPFUL:
        self.truemint_guardians_balances[creator] += 2
    elif note.current_rating == Rating.NOT_HELPFUL:
        self.truemint_guardians_balances[creator] -= 2


@external
def submit_final_rating(creator: address, content: bytes32, final_rating: Rating):
    assert msg.sender == self.owner, "Only TrueMintHQ can submit the final rating!"
    note: Note = self.get_note(creator, content)
    note.current_rating = final_rating
    note.is_final = True
    self.launch_rewards(creator, note)
